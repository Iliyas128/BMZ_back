const express = require("express");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const Product = require("../models/Product");

const router = express.Router();

router.get("/categories", async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

router.get("/categories/:slug", async (req, res, next) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      isActive: true,
    }).lean();

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subcategories = await Subcategory.find({
      category: category._id,
      isActive: true,
    })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return res.json({ ...category, subcategories });
  } catch (error) {
    return next(error);
  }
});

router.get("/subcategories/:slug", async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findOne({
      slug: req.params.slug,
      isActive: true,
    })
      .populate("category")
      .lean();

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    const products = await Product.find({
      subcategory: subcategory._id,
      isActive: true,
    })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return res.json({ ...subcategory, products });
  } catch (error) {
    return next(error);
  }
});

router.get("/products", async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "12", 10), 1), 50);
    const skip = (page - 1) * limit;

    const filter = { isActive: true };

    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.subcategory) {
      filter.subcategory = req.query.subcategory;
    }
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: "i" };
    }

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category")
        .populate("subcategory")
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/products/:slug", async (req, res, next) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    })
      .populate("category")
      .populate("subcategory")
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    return next(error);
  }
});

router.get("/tree", async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    const subcategories = await Subcategory.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    const products = await Product.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    const categoryMap = new Map(
      categories.map((c) => [String(c._id), { ...c, subcategories: [] }])
    );

    const subMap = new Map(
      subcategories.map((s) => [String(s._id), { ...s, products: [] }])
    );

    subMap.forEach((s) => {
      const parent = categoryMap.get(String(s.category));
      if (parent) parent.subcategories.push(s);
    });

    products.forEach((p) => {
      const parent = subMap.get(String(p.subcategory));
      if (parent) parent.products.push(p);
    });

    res.json(Array.from(categoryMap.values()));
  } catch (error) {
    next(error);
  }
});

module.exports = router;

