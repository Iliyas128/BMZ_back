const express = require("express");
const HomeContent = require("../models/HomeContent");
const { HOME_DEFAULTS } = require("../data/homeDefaults");
const { mergeDeep } = require("../utils/mergeDeep");
const { requireAdmin } = require("../middlewares/auth");

const router = express.Router();
router.use(requireAdmin);

router.get("/", async (req, res, next) => {
  try {
    const doc = await HomeContent.findOne().lean();
    const merged = mergeDeep(HOME_DEFAULTS, doc?.snapshot || {});
    res.json(merged);
  } catch (e) {
    next(e);
  }
});

router.put("/", async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({ message: "Body must be a JSON object (home content)" });
    }
    await HomeContent.findOneAndUpdate({}, { snapshot: req.body }, { upsert: true, new: true });
    const merged = mergeDeep(HOME_DEFAULTS, req.body);
    res.json(merged);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
