/**
 * Категории, демо-каталог (автовесы), контент главной.
 * Usage: npm run seed
 */
require("./config/env");
const mongoose = require("mongoose");
const { assertMongoUri } = require("./config/env");
const { connectDB } = require("./config/db");
const Category = require("./models/Category");
const Subcategory = require("./models/Subcategory");
const Product = require("./models/Product");
const HomeContent = require("./models/HomeContent");
const { HOME_DEFAULTS } = require("./data/homeDefaults");

const DEFAULT_CATEGORIES = [
  {
    name: "Автомобильные весы",
    slug: "avtomobilnye-vesy",
    description:
      "Для логистики, складов и предприятий: стандартные и усиленные решения.",
    image: "/images/avtoVesy.png",
    order: 0,
  },
  {
    name: "Железнодорожные весы",
    slug: "zheleznodorozhnye-vesy",
    description: "Вагонные решения с расчетом под объект и нагрузку.",
    image: "/images/vagonVesy.png",
    order: 1,
  },
];

const AUTO_SUBS = [
  {
    slug: "standartnye-avovesy",
    name: "Стандартные",
    description:
      "Для логистики, складов и предприятий. Оптимальные решения для типовых объектов.",
    order: 0,
    image: "",
  },
  {
    slug: "promyshlennye-selhoz",
    name: "Промышленные / Сельхоз",
    description:
      "Под зернобазы, агропредприятия и крупные склады. Длинные платформы и высокая нагрузка.",
    order: 1,
    image: "",
  },
  {
    slug: "usilennye-karery",
    name: "Усиленные (карьеры)",
    description:
      "Для карьеров и горнодобычи: усиленная конструкция, повышенная нагрузка на ось.",
    order: 2,
    image: "",
  },
];

function buildSpecs80t() {
  return {
    dim: "18 × 3 м",
    platform: "18 × 3,2 м",
    cap: "80 т",
    sensors: "8 шт. IP68",
    table: [
      ["Грузоподъёмность (НПВ)", "80 тонн"],
      ["Платформа (Д × Ш × В)", "18 000 × 3 200 × 600 мм"],
      ["Дискретность", "20 кг"],
      ["Тензодатчики", "8 шт. Zemic IP68"],
      ["Весовой индикатор", "IP65, сенсорный"],
      ["Несущая балка", "60Б1 — 600 мм"],
      ["Толщина настила", "8 мм рифлёный"],
      ["Температура работы", "−50°С … +50°С"],
      ["Время взвешивания", "5 секунд"],
      ["Класс точности", "Средний III (ГОСТ 29329)"],
    ],
    includes: [
      "Грузоприёмная платформа (3 секции × 6 м)",
      "8 тензодатчиков Zemic / IP68",
      "Весовой индикатор IP65, RS-232/RS-485",
      "Соединительная коробка IP68",
      "Кабельная разводка",
      "Монтаж и пуско-наладка",
      "Обучение персонала на объекте",
      "Паспорт, документация, сертификат типа",
      "Свидетельство о поверке на 1 год",
    ],
    deliveryNote:
      "Доставка — по всему Казахстану, рассчитывается по адресу.\nФундамент — 3 варианта на выбор:\nРаздельный с пандусами — от 3 500 000 ₸\nСплошной с пандусами — от 5 600 000 ₸\nПриямочного типа — от 9 100 000 ₸",
    certNote:
      "ГОСТ РК — допущены к коммерческому взвешиванию.\nГосреестр РК — зарегистрированы как средство измерения.\nСертификат СТ-КЗ — произведено в Казахстане.",
  };
}

/** subSlug -> products */
const AUTO_PRODUCTS = {
  "standartnye-avovesy": [
    {
      slug: "bmz-40a-6x3",
      name: "БМЗ-40А / 6×3",
      shortDescription: "Малогабаритные весы · 40 тонн",
      description: "Стационарные автомобильные весы 40 т, платформа 6×3 м.",
      price: 3200000,
      order: 0,
      specs: {
        dim: "6 × 3 м",
        platform: "6 × 3 м",
        cap: "40 т",
        sensors: "4 шт. IP68",
        table: [
          ["Грузоподъёмность (НПВ)", "40 тонн"],
          ["Платформа", "6 000 × 3 000 мм"],
          ["Тензодатчики", "4 шт. IP68"],
        ],
        includes: ["Платформа", "Индикатор", "Монтаж"],
      },
    },
    {
      slug: "bmz-40a-12x3",
      name: "БМЗ-40А / 12×3",
      shortDescription: "Стандартные весы · 40 тонн",
      description: "Стационарные автовесы 40 т, платформа 12×3 м.",
      price: 4500000,
      order: 1,
      specs: {
        dim: "12 × 3 м",
        platform: "12 × 3 м",
        cap: "40 т",
        sensors: "6 шт. IP68",
        table: [
          ["Грузоподъёмность (НПВ)", "40 тонн"],
          ["Платформа", "12 000 × 3 000 мм"],
        ],
        includes: ["Платформа", "Индикатор", "Монтаж"],
      },
    },
    {
      slug: "bmz-60a-12x3",
      name: "БМЗ-60А / 12×3",
      shortDescription: "Стандартные весы · 60 тонн",
      description: "Стационарные автовесы 60 т, платформа 12×3 м.",
      price: 5900000,
      order: 2,
      specs: {
        dim: "12 × 3 м",
        platform: "12 × 3 м",
        cap: "60 т",
        sensors: "6 шт. IP68",
        table: [["Грузоподъёмность (НПВ)", "60 тонн"]],
        includes: ["Платформа", "Индикатор", "Монтаж"],
      },
    },
    {
      slug: "bmz-60a-18x3",
      name: "БМЗ-60А / 18×3",
      shortDescription: "Промышленные весы · 60 тонн",
      description: "Стационарные автовесы 60 т, платформа 18×3 м.",
      price: 6500000,
      order: 3,
      specs: {
        dim: "18 × 3 м",
        platform: "18 × 3 м",
        cap: "60 т",
        sensors: "8 шт. IP68",
        table: [["Грузоподъёмность (НПВ)", "60 тонн"]],
        includes: ["Платформа", "Индикатор", "Монтаж"],
      },
    },
    {
      slug: "bmz-80a-18x3",
      name: "БМЗ-80А / 18×3 м",
      shortDescription: "Промышленные весы · 80 тонн",
      description: "Стационарные автовесы · 80 тонн · сталь С345. Платформа 18×3,2 м.",
      price: 8000000,
      order: 4,
      specs: buildSpecs80t(),
    },
  ],
  "promyshlennye-selhoz": [
    {
      slug: "bmz-100a-18x3",
      name: "БМЗ-100А / 18×3",
      shortDescription: "Промышленные · 100 тонн",
      description: "Весы 100 т, платформа 18×3 м.",
      price: 9900000,
      order: 0,
      specs: {
        dim: "18 × 3 м",
        platform: "18 × 3 м",
        cap: "100 т",
        sensors: "8 шт. IP68",
        table: [["Грузоподъёмность (НПВ)", "100 тонн"]],
        includes: ["Платформа", "Индикатор", "Монтаж"],
      },
    },
    {
      slug: "bmz-100a-24x3",
      name: "БМЗ-100А / 24×3",
      shortDescription: "Сельхоз · 100 тонн",
      description: "Весы 100 т, платформа 24×3 м.",
      price: 11500000,
      order: 1,
      specs: {
        dim: "24 × 3 м",
        cap: "100 т",
        sensors: "10 шт. IP68",
        table: [["Грузоподъёмность (НПВ)", "100 тонн"]],
        includes: ["Платформа", "Индикатор", "Монтаж"],
      },
    },
    {
      slug: "bmz-100a-24x35",
      name: "БМЗ-100А / 24×3.5",
      shortDescription: "Широкая платформа · 100 тонн",
      description: "Весы 100 т, платформа 24×3,5 м.",
      price: 12200000,
      order: 2,
      specs: {
        dim: "24 × 3,5 м",
        cap: "100 т",
        sensors: "10 шт. IP68",
        table: [["Грузоподъёмность (НПВ)", "100 тонн"]],
        includes: ["Платформа", "Индикатор", "Монтаж"],
      },
    },
  ],
  "usilennye-karery": [
    {
      slug: "bmz-100u-18x3",
      name: "БМЗ-100У / 18×3",
      shortDescription: "Усиленная конструкция · 100 тонн",
      description: "Усиленные весы для карьеров, 100 т.",
      price: 12500000,
      order: 0,
      specs: {
        dim: "18 × 3 м · 100 т усил.",
        cap: "100 т",
        sensors: "Нагрузка на ось до 40 т",
        table: [["Особенность", "Усиленная балка и настил"]],
        includes: ["Платформа усил.", "Индикатор", "Монтаж"],
      },
    },
    {
      slug: "bmz-120u-18x3",
      name: "БМЗ-120У / 18×3",
      shortDescription: "Максимальная нагрузка · 120 тонн",
      description: "Усиленные весы 120 т для карьеров.",
      price: 14000000,
      order: 1,
      specs: {
        dim: "18 × 3 м · 120 т усил.",
        cap: "120 т",
        sensors: "Нагрузка на ось до 40 т",
        table: [["Грузоподъёмность (НПВ)", "120 тонн"]],
        includes: ["Платформа усил.", "Индикатор", "Монтаж"],
      },
    },
  ],
};

async function ensureCategory(row) {
  let doc = await Category.findOne({ slug: row.slug });
  if (!doc) {
    doc = await Category.create({
      name: row.name,
      slug: row.slug,
      description: row.description,
      image: row.image,
      isActive: true,
      order: row.order,
    });
    // eslint-disable-next-line no-console
    console.log(`  + category: ${row.slug}`);
  }
  return doc;
}

async function ensureSubcategory(categoryId, row) {
  let doc = await Subcategory.findOne({ slug: row.slug });
  if (!doc) {
    doc = await Subcategory.create({
      category: categoryId,
      name: row.name,
      slug: row.slug,
      description: row.description || "",
      image: row.image || "",
      isActive: true,
      order: row.order,
    });
    // eslint-disable-next-line no-console
    console.log(`    + subcategory: ${row.slug}`);
  }
  return doc;
}

async function ensureProduct(categoryId, subcategoryId, row) {
  const exists = await Product.findOne({ slug: row.slug });
  if (exists) return;
  await Product.create({
    category: categoryId,
    subcategory: subcategoryId,
    name: row.name,
    slug: row.slug,
    sku: row.slug,
    shortDescription: row.shortDescription || "",
    description: row.description || "",
    price: row.price ?? 0,
    currency: "KZT",
    images: [],
    specs: row.specs || {},
    tags: [],
    isActive: true,
    inStock: true,
    order: row.order ?? 0,
  });
  // eslint-disable-next-line no-console
  console.log(`      + product: ${row.slug}`);
}

async function run() {
  const { mongoUri } = assertMongoUri();
  await connectDB(mongoUri);

  // eslint-disable-next-line no-console
  console.log("Seeding categories...");
  for (const row of DEFAULT_CATEGORIES) {
    await ensureCategory(row);
  }

  await HomeContent.findOneAndUpdate({}, { snapshot: HOME_DEFAULTS }, { upsert: true });
  // eslint-disable-next-line no-console
  console.log("Home content snapshot upserted.");

  const autoCat = await Category.findOne({ slug: "avtomobilnye-vesy" });
  if (autoCat) {
    // eslint-disable-next-line no-console
    console.log("Seeding автовесы: подкатегории и товары...");
    for (const subRow of AUTO_SUBS) {
      const sub = await ensureSubcategory(autoCat._id, subRow);
      const products = AUTO_PRODUCTS[subRow.slug] || [];
      for (const p of products) {
        await ensureProduct(autoCat._id, sub._id, p);
      }
    }
  }

  await mongoose.disconnect();
  // eslint-disable-next-line no-console
  console.log("Seed finished.");
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
