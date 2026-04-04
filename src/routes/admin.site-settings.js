const express = require("express");
const { body } = require("express-validator");
const SiteSettings = require("../models/SiteSettings");
const { requireAdmin } = require("../middlewares/auth");
const { validateRequest } = require("../middlewares/validate");

const router = express.Router();
router.use(requireAdmin);

async function getOrCreate() {
  let doc = await SiteSettings.findOne();
  if (!doc) {
    doc = await SiteSettings.create({});
  }
  return doc;
}

router.get("/", async (req, res, next) => {
  try {
    const doc = await getOrCreate();
    return res.json({ whatsappE164: doc.whatsappE164 || "" });
  } catch (error) {
    return next(error);
  }
});

router.put(
  "/",
  [body("whatsappE164").optional().isString(), validateRequest],
  async (req, res, next) => {
    try {
      const raw = req.body.whatsappE164;
      const whatsappE164 =
        raw === undefined || raw === null ? undefined : String(raw).trim();

      const doc = await getOrCreate();
      if (whatsappE164 !== undefined) {
        doc.whatsappE164 = whatsappE164;
        await doc.save();
      }
      return res.json({ whatsappE164: doc.whatsappE164 || "" });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
