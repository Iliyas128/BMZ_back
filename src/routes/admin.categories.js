const express = require("express");
const Category = require("../models/Category");
const { requireAdmin } = require("../middlewares/auth");

const router = express.Router();

router.use(requireAdmin);

const categoriesLockedMessage =
  "Шесть направлений каталога зафиксированы. В админке создавайте и редактируйте только подкатегории и товары.";

router.get("/", async (req, res, next) => {
  try {
    const items = await Category.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.post("/", (req, res) => {
  res.status(403).json({ message: categoriesLockedMessage });
});

router.put("/:id", (req, res) => {
  res.status(403).json({ message: categoriesLockedMessage });
});

router.delete("/:id", (req, res) => {
  res.status(403).json({ message: categoriesLockedMessage });
});

module.exports = router;

