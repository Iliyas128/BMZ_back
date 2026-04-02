const express = require("express");
const { body } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { validateRequest } = require("../middlewares/validate");
const AdminOtp = require("../models/AdminOtp");
const Admin = require("../models/Admin");
const { sendAdminOtpEmail } = require("../utils/email");

const router = express.Router();

function randomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

router.post(
  "/request",
  [
    body("email").isEmail(),
    body("fullName").isString().isLength({ min: 2 }),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      if (!process.env.ADMIN_EMAIL) {
        return res.status(400).json({ message: "ADMIN_EMAIL not configured" });
      }

      const code = randomCode();
      const codeHash = await bcrypt.hash(code, 10);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      const doc = await AdminOtp.create({
        requesterEmail: req.body.email.trim().toLowerCase(),
        requesterName: req.body.fullName.trim(),
        codeHash,
        expiresAt,
      });

      await sendAdminOtpEmail({
        to: process.env.ADMIN_EMAIL,
        code,
        requesterEmail: doc.requesterEmail,
        requesterName: doc.requesterName,
      });

      return res.json({
        requestId: String(doc._id),
        expiresAt: doc.expiresAt.toISOString(),
        message: "OTP sent to admin email",
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.post(
  "/verify",
  [
    body("requestId").isMongoId(),
    body("code").isString().isLength({ min: 4, max: 10 }),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      const doc = await AdminOtp.findById(req.body.requestId);
      if (!doc) return res.status(404).json({ message: "Request not found" });

      if (doc.usedAt) return res.status(409).json({ message: "Code already used" });
      if (doc.expiresAt.getTime() < Date.now()) {
        return res.status(410).json({ message: "Code expired" });
      }
      if (doc.attempts >= 8) {
        return res.status(429).json({ message: "Too many attempts" });
      }

      doc.attempts += 1;
      const ok = await bcrypt.compare(req.body.code, doc.codeHash);
      if (!ok) {
        await doc.save();
        return res.status(401).json({ message: "Invalid code" });
      }

      doc.usedAt = new Date();
      await doc.save();

      if (!process.env.JWT_SECRET || String(process.env.JWT_SECRET).length < 8) {
        return res.status(500).json({ message: "Server misconfiguration: JWT_SECRET" });
      }

      // Ensure there is an Admin record (admin panel uses JWT anyway).
      // If admin doesn't exist yet, auto-create it with ADMIN_EMAIL.
      let admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL.toLowerCase() });
      if (!admin) {
        admin = await Admin.create({
          username: "owner",
          email: process.env.ADMIN_EMAIL.toLowerCase(),
          passwordHash: await bcrypt.hash(randomCode() + randomCode(), 10),
        });
      }

      const token = jwt.sign(
        { id: String(admin._id), role: admin.role, username: admin.username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        token,
        admin: { id: admin._id, username: admin.username, email: admin.email },
      });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;

