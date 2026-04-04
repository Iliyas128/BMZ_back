const mongoose = require("mongoose");

const homeContentSchema = new mongoose.Schema(
  {
    snapshot: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeContent", homeContentSchema);
