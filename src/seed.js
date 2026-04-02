/**
 * Populate demo categories (run once after MongoDB is configured).
 * Usage: npm run seed
 */
require("./config/env");
const mongoose = require("mongoose");
const { assertMongoUri } = require("./config/env");
const { connectDB } = require("./config/db");
const Category = require("./models/Category");

const DEFAULT_CATEGORIES = [
  {
    key: "car",
    name: "Автомобильные весы",
    slug: "avtomobilnye-vesy",
    description:
      "Для логистики, складов и предприятий: стандартные и усиленные решения.",
    image: "/images/avtoVesy.png",
    order: 0,
  },
  {
    key: "rail",
    name: "Железнодорожные весы",
    slug: "zheleznodorozhnye-vesy",
    description: "Вагонные решения с расчетом под объект и нагрузку.",
    image: "/images/vagonVesy.png",
    order: 1,
  },
  {
    key: "foundation",
    name: "Фундамент и основание",
    slug: "fundament",
    description: "Раздельные, сплошные и приямочного типа решения с пандусами.",
    image: "/images/fundament.png",
    order: 2,
  },
  {
    key: "automation",
    name: "Автоматизация",
    slug: "avtomatizatsiya",
    description: "ПО и интеграции для учета, контроля и удаленного мониторинга.",
    image: "/images/avtomatization.jpg",
    order: 3,
  },
  {
    key: "equipment",
    name: "Оборудование",
    slug: "oborudovanie",
    description: "Тензодатчики, индикаторы и компоненты для разных условий эксплуатации.",
    image: "/images/oborudovanie.png",
    order: 4,
  },
  {
    key: "services",
    name: "Услуги",
    slug: "uslugi",
    description: "Монтаж и ПНР, калибровка, поверка, модернизация и ремонт.",
    image: "/images/Uslugi.png",
    order: 5,
  },
];

async function run() {
  const { mongoUri } = assertMongoUri();
  await connectDB(mongoUri);
  let created = 0;
  let skipped = 0;

  for (const row of DEFAULT_CATEGORIES) {
    const exists = await Category.findOne({ slug: row.slug }).lean();
    if (exists) {
      skipped += 1;
      continue;
    }
    await Category.create({
      name: row.name,
      slug: row.slug,
      description: row.description,
      image: row.image,
      isActive: true,
      order: row.order,
    });
    created += 1;
  }

  // eslint-disable-next-line no-console
  console.log(`Seed done: ${created} created, ${skipped} already present.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
