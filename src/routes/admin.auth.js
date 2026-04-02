const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
const Admin = require("../models/Admin");
const { validateRequest } = require("../middlewares/validate");
const { requireAdmin } = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/bootstrap",
  [
    body("bootstrapKey").isString().notEmpty(),
    body("username").isString().isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isString().isLength({ min: 6 }),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      if (!process.env.ADMIN_BOOTSTRAP_KEY) {
        return res.status(400).json({ message: "ADMIN_BOOTSTRAP_KEY not configured" });
      }

      if (req.body.bootstrapKey !== process.env.ADMIN_BOOTSTRAP_KEY) {
        return res.status(403).json({ message: "Invalid bootstrap key" });
      }

      const exists = await Admin.findOne().lean();
      if (exists) {
        return res.status(409).json({ message: "Admin already exists" });
      }

      const passwordHash = await bcrypt.hash(req.body.password, 10);
      const admin = await Admin.create({
        username: req.body.username.trim(),
        email: req.body.email.trim().toLowerCase(),
        passwordHash,
      });

      return res.status(201).json({
        message: "Admin created",
        admin: { id: admin._id, username: admin.username, email: admin.email },
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").isString().isLength({ min: 1 }),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      const admin = await Admin.findOne({
        email: req.body.email.trim().toLowerCase(),
      });
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const ok = await bcrypt.compare(req.body.password, admin.passwordHash);
      if (!ok) {
        return res.status(401).json({ message: "Invalid credentials" });
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

router.get("/me", requireAdmin, async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-passwordHash").lean();
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.json(admin);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

