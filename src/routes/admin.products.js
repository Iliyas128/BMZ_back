const express = require("express");
const { body, param } = require("express-validator");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const { requireAdmin } = require("../middlewares/auth");
const { validateRequest } = require("../middlewares/validate");
const { slugify } = require("../utils/slugify");

const router = express.Router();

router.use(requireAdmin);

router.get("/", async (req, res, next) => {
  try {
    const items = await Product.find()
      .populate("category")
      .populate("subcategory")
      .sort({ order: 1, createdAt: -1 })
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
    body("subcategory").isMongoId(),
    body("name").isString().isLength({ min: 2 }),
    body("slug").optional().isString(),
    body("sku").optional().isString(),
    body("shortDescription").optional().isString(),
    body("description").optional().isString(),
    body("price").optional().isFloat(),
    body("currency").optional().isString(),
    body("images").optional().isArray(),
    body("accent").optional().isIn(["blue", "green", "orange"]),
    body("specs").optional().isObject(),
    body("tags").optional().isArray(),
    body("isActive").optional().isBoolean(),
    body("inStock").optional().isBoolean(),
    body("order").optional().isFloat(),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      const [category, subcategory] = await Promise.all([
        Category.findById(req.body.category).lean(),
        Subcategory.findById(req.body.subcategory).lean(),
      ]);

      if (!category) return res.status(400).json({ message: "Invalid category" });
      if (!subcategory) return res.status(400).json({ message: "Invalid subcategory" });

      const slug = slugify(req.body.slug || req.body.name);
      const created = await Product.create({
        category: req.body.category,
        subcategory: req.body.subcategory,
        name: req.body.name.trim(),
        slug,
        sku: req.body.sku || "",
        shortDescription: req.body.shortDescription || "",
        description: req.body.description || "",
        price: req.body.price ?? 0,
        currency: req.body.currency || "KZT",
        images: req.body.images || [],
        specs: req.body.specs || {},
        tags: req.body.tags || [],
        accent: req.body.accent || "blue",
        isActive: req.body.isActive ?? true,
        inStock: req.body.inStock ?? true,
        order: req.body.order ?? 0,
      });

      const populated = await Product.findById(created._id)
        .populate("category")
        .populate("subcategory")
        .lean();
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
    body("subcategory").optional().isMongoId(),
    body("name").optional().isString().isLength({ min: 2 }),
    body("slug").optional().isString(),
    body("sku").optional().isString(),
    body("shortDescription").optional().isString(),
    body("description").optional().isString(),
    body("price").optional().isFloat(),
    body("currency").optional().isString(),
    body("images").optional().isArray(),
    body("accent").optional().isIn(["blue", "green", "orange"]),
    body("specs").optional().isObject(),
    body("tags").optional().isArray(),
    body("isActive").optional().isBoolean(),
    body("inStock").optional().isBoolean(),
    body("order").optional().isFloat(),
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
      if (patch.subcategory) {
        const subcategory = await Subcategory.findById(patch.subcategory).lean();
        if (!subcategory) return res.status(400).json({ message: "Invalid subcategory" });
      }

      const item = await Product.findByIdAndUpdate(req.params.id, patch, {
        new: true,
        runValidators: true,
      })
        .populate("category")
        .populate("subcategory");

      if (!item) return res.status(404).json({ message: "Product not found" });
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
      const item = await Product.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ message: "Product not found" });
      return res.json({ message: "Deleted" });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;

