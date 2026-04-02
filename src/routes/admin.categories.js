const express = require("express");
const { body, param } = require("express-validator");
const Category = require("../models/Category");
const { requireAdmin } = require("../middlewares/auth");
const { validateRequest } = require("../middlewares/validate");
const { slugify } = require("../utils/slugify");

const router = express.Router();

router.use(requireAdmin);

router.get("/", async (req, res, next) => {
  try {
    const items = await Category.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  [
    body("name").isString().isLength({ min: 2 }),
    body("slug").optional().isString(),
    body("description").optional().isString(),
    body("image").optional().isString(),
    body("isActive").optional().isBoolean(),
    body("order").optional().isNumeric(),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      const slug = slugify(req.body.slug || req.body.name);
      const item = await Category.create({
        name: req.body.name.trim(),
        slug,
        description: req.body.description || "",
        image: req.body.image || "",
        isActive: req.body.isActive ?? true,
        order: req.body.order ?? 0,
      });
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  [
    param("id").isMongoId(),
    body("name").optional().isString().isLength({ min: 2 }),
    body("slug").optional().isString(),
    body("description").optional().isString(),
    body("image").optional().isString(),
    body("isActive").optional().isBoolean(),
    body("order").optional().isNumeric(),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      const patch = { ...req.body };
      if (patch.name) patch.name = patch.name.trim();
      if (patch.slug || patch.name) patch.slug = slugify(patch.slug || patch.name);

      const item = await Category.findByIdAndUpdate(req.params.id, patch, {
        new: true,
        runValidators: true,
      });

      if (!item) return res.status(404).json({ message: "Category not found" });
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
      const item = await Category.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ message: "Category not found" });
      return res.json({ message: "Deleted" });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;

