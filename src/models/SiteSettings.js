const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    whatsappE164: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
