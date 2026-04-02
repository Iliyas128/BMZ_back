const express = require("express");
const mongoose = require("mongoose");
const { connectionStateLabel } = require("../config/db");

const router = express.Router();

router.get("/", (req, res) => {
  const dbOk = mongoose.connection.readyState === 1;
  res.json({
    status: dbOk ? "ok" : "degraded",
    service: "bmz-backend",
    time: new Date().toISOString(),
    database: {
      state: connectionStateLabel(),
      connected: dbOk,
    },
  });
});

module.exports = router;
