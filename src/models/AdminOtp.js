const mongoose = require("mongoose");

const adminOtpSchema = new mongoose.Schema(
  {
    requesterEmail: { type: String, required: true, lowercase: true, trim: true },
    requesterName: { type: String, required: true, trim: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    usedAt: { type: Date, default: null },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

adminOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("AdminOtp", adminOtpSchema);

