const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const healthRoute = require("./routes/health");
const publicCatalogRoute = require("./routes/public.catalog");
const adminAuthRoute = require("./routes/admin.auth");
const adminOtpRoute = require("./routes/admin.otp");
const adminCategoriesRoute = require("./routes/admin.categories");
const adminSubcategoriesRoute = require("./routes/admin.subcategories");
const adminProductsRoute = require("./routes/admin.products");
const { notFound, errorHandler } = require("./middlewares/error");

const app = express();

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim()).filter(Boolean)
  : null;
app.use(
  cors({
    origin: corsOrigins && corsOrigins.length ? corsOrigins : true,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "BMZ backend API" });
});

app.use("/api/health", healthRoute);
app.use("/api/catalog", publicCatalogRoute);

app.use("/api/admin/auth", adminAuthRoute);
app.use("/api/admin/otp", adminOtpRoute);
app.use("/api/admin/categories", adminCategoriesRoute);
app.use("/api/admin/subcategories", adminSubcategoriesRoute);
app.use("/api/admin/products", adminProductsRoute);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

