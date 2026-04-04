const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    sku: { type: String, default: "", trim: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    price: { type: Number, default: 0 },
    currency: { type: String, default: "KZT" },
    images: [{ type: String }],
    accent: {
      type: String,
      enum: ["blue", "green", "orange"],
      default: "blue",
    },
    specs: { type: Object, default: {} },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
    inStock: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

