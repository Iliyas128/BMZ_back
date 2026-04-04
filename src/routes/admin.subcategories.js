const express = require("express");
const { body, param } = require("express-validator");
const Subcategory = require("../models/Subcategory");
const Category = require("../models/Category");
const { requireAdmin } = require("../middlewares/auth");
const { validateRequest } = require("../middlewares/validate");
const { slugify } = require("../utils/slugify");

const router = express.Router();

router.use(requireAdmin);

router.get("/", async (req, res, next) => {
  try {
    const items = await Subcategory.find()
      .populate("category")
      .sort({ order: 1, createdAt: 1 })
      .lean();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  [
    body("category").isMongoId(),
    body("name").isString().isLength({ min: 2 }),
    body("slug").optional().isString(),
    body("description").optional().isString(),
    body("image").optional().isString(),
    body("accent").optional().isIn(["blue", "green", "orange"]),
    body("isActive").optional().isBoolean(),
    body("order").optional().isNumeric(),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      const category = await Category.findById(req.body.category).lean();
      if (!category) return res.status(400).json({ message: "Invalid category" });

      const slug = slugify(req.body.slug || req.body.name);
      const item = await Subcategory.create({
        category: req.body.category,
        name: req.body.name.trim(),
        slug,
        description: req.body.description || "",
        image: req.body.image || "",
        accent: req.body.accent || "blue",
        isActive: req.body.isActive ?? true,
        order: req.body.order ?? 0,
      });

      const populated = await item.populate("category");
      return res.status(201).json(populated);
    } catch (error) {
      return next(error);
    }
  }
);

router.put(
  "/:id",
  [
    param("id").isMongoId(),
    body("category").optional().isMongoId(),
    body("name").optional().isString().isLength({ min: 2 }),
    body("slug").optional().isString(),
    body("description").optional().isString(),
    body("image").optional().isString(),
    body("accent").optional().isIn(["blue", "green", "orange"]),
    body("isActive").optional().isBoolean(),
    body("order").optional().isNumeric(),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      const patch = { ...req.body };
      if (patch.name) patch.name = patch.name.trim();
      if (patch.slug || patch.name) patch.slug = slugify(patch.slug || patch.name);

      if (patch.category) {
        const category = await Category.findById(patch.category).lean();
        if (!category) return res.status(400).json({ message: "Invalid category" });
      }

      const item = await Subcategory.findByIdAndUpdate(req.params.id, patch, {
        new: true,
        runValidators: true,
      }).populate("category");

      if (!item) return res.status(404).json({ message: "Subcategory not found" });
      return res.json(item);
    } catch (error) {
      return next(error);
    }
  }
);

router.delete(
  "/:id",
  [param("id").isMongoId(), validateRequest],
  async (req, res, next) => {
    try {
      const item = await Subcategory.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ message: "Subcategory not found" });
      return res.json({ message: "Deleted" });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;

