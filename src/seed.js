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
  {
    name: "Оборудование",
    slug: "oborudovanie",
    description:
      "Тензодатчики, индикаторы и компоненты для разных условий эксплуатации.",
    image: "/images/oborudovanie.png",
    order: 2,
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
    name: "Промышленные / агро",
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

const EQUIPMENT_SUBS = [
  {
    slug: "tensodatchiki",
    name: "Тензодатчики",
    description: "Датчики нагрузки для весовых систем различной грузоподъёмности.",
    order: 0,
    image: "",
  },
  {
    slug: "indikatory",
    name: "Индикаторы",
    description: "Весовые индикаторы для отображения и управления измерениями.",
    order: 1,
    image: "",
  },
  {
    slug: "kranovye-platformennye",
    name: "Крановые и платформенные весы",
    description: "Готовые весовые системы для кранов и платформ.",
    order: 2,
    image: "",
  },
  {
    slug: "umnie-vesy-zhivotnye",
    name: "Умные весы для животных",
    description: "Специализированные весы с контролем веса животных и учётом поголовья.",
    order: 3,
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

/** subSlug -> products for equipment */
const EQUIPMENT_PRODUCTS = {
  "tensodatchiki": [
    {
      slug: "zemic-hz8c",
      name: "Zemic HZ8C / IP67",
      shortDescription: "Тензодатчик до 5 т",
      description: "Компрессионный тензодатчик Zemic HZ8C, IP67, монтаж под платформу.",
      price: 85000,
      order: 0,
      specs: {
        cap: "до 5 т",
        class: "C3",
        table: [
          ["Класс точности", "C3"],
          ["Защита", "IP67"],
          ["Питание", "5-12В"],
          ["Выход", "mV/V"],
        ],
        includes: ["Тензодатчик", "Разъём", "Документация"],
      },
    },
    {
      slug: "zemic-hz16c",
      name: "Zemic HZ16C / IP68",
      shortDescription: "Тензодатчик до 10 т · IP68",
      description: "Компрессионный тензодатчик Zemic HZ16C, IP68, полная герметизация.",
      price: 125000,
      order: 1,
      specs: {
        cap: "до 10 т",
        class: "C3",
        table: [
          ["Класс точности", "C3"],
          ["Защита", "IP68"],
          ["Питание", "5-12В"],
        ],
        includes: ["Тензодатчик", "Разъём", "Кабель 5м"],
      },
    },
    {
      slug: "cas-lcs30",
      name: "CAS LCS30 / Компактный",
      shortDescription: "Тензодатчик до 30 кг",
      description: "Компактный тензодатчик для малых конструкций и модулей взвешивания.",
      price: 45000,
      order: 2,
      specs: {
        cap: "до 30 кг",
        class: "C2",
        table: [
          ["Материал", "Алюминий"],
          ["Защита", "IP66"],
          ["Питание", "5В"],
        ],
        includes: ["Датчик", "Схема подключения"],
      },
    },
  ],
  "indikatory": [
    {
      slug: "cas-ci6010-ip65",
      name: "CAS CI-6010 IP65",
      shortDescription: "Весовой индикатор с дисплеем · IP65",
      description: "Весовой индикатор нержавейка, 7\" дисплей, RS-232/485, IP65.",
      price: 450000,
      order: 0,
      specs: {
        display: "7 дюймов",
        class: "IP65",
        table: [
          ["Материал корпуса", "Нержавейка"],
          ["Интерфейсы", "RS-232, RS-485"],
          ["Питание", "220В"],
          ["Класс защиты", "IP65"],
        ],
        includes: ["Индикатор", "Кабель питания", "Документация"],
      },
    },
    {
      slug: "a12e-indicator",
      name: "A12e / Портативный индикатор",
      shortDescription: "Переносной весовой индикатор",
      description: "Портативный индикатор для полевых измерений с батареей 6 ч.",
      price: 280000,
      order: 1,
      specs: {
        display: "5.7 дюймов",
        battery: "6 часов работы",
        table: [
          ["Материал", "Алюминий"],
          ["Питание", "Li-ion 5000 мА"],
          ["Выход", "RS-485, USB"],
        ],
        includes: ["Индикатор", "Батарея", "Зарядка"],
      },
    },
    {
      slug: "cas-ci-6s",
      name: "CAS CI-6S Сенсорный",
      shortDescription: "Сенсорный индикатор · 10\" экран",
      description: "Сенсорный весовой индикатор с цветным дисплеем 10\", поддержка 4-8 датчиков.",
      price: 680000,
      order: 2,
      specs: {
        display: "10 дюймов сенсорный",
        sensors: "4-8 датчиков",
        table: [
          ["Разрешение дисплея", "1280x800"],
          ["Интерфейсы", "RS-232, RS-485, Ethernet"],
          ["Класс защиты", "IP65"],
        ],
        includes: ["Индикатор", "Кабели", "Программное обеспечение"],
      },
    },
  ],
  "kranovye-platformennye": [
    {
      slug: "kranovy-dinamometr-500kg",
      name: "Крановые весы METTLER 500 кг",
      shortDescription: "Подвесные весы · до 500 кг",
      description: "Крановые динамометры для взвешивания груза в подвеске. Цифровой дисплей.",
      price: 350000,
      order: 0,
      specs: {
        cap: "500 кг",
        display: "цифровой LCD",
        table: [
          ["Точность", "±0.2%"],
          ["Питание", "батарея AA 2шт"],
          ["Материал шкалы", "нержавейка"],
          ["Рабочая температура", "-10 … +50°С"],
        ],
        includes: ["Динамометр", "Батареи", "Паспорт"],
      },
    },
    {
      slug: "platformennye-vesy-300kg",
      name: "Платформенные весы 30×40 см",
      shortDescription: "Компактные весы для стола · 300 кг",
      description: "Портативные весы на платформе 30×40 см, максимум 300 кг, сенсор.",
      price: 125000,
      order: 1,
      specs: {
        platform: "300 × 400 мм",
        cap: "300 кг",
        table: [
          ["Точность", "50 г"],
          ["Питание", "батарея / USB"],
          ["Класс", "III (ГОСТ 29329)"],
        ],
        includes: ["Весы", "Батареи", "Инструкция"],
      },
    },
  ],
  "umnie-vesy-zhivotnye": [
    {
      slug: "vesy-korov-vsd-12",
      name: "ALLFLEX VSD-12 для коров",
      shortDescription: "Умные весы для отслеживания веса коров",
      description: "Система контроля веса на откормочной площадке с сенсорами по бокам.",
      price: 1200000,
      order: 0,
      specs: {
        animal: "КРС",
        platform: "пассивные ворота",
        table: [
          ["Область применения", "Скотомогильник, загон"],
          ["Точность", "±50 кг"],
          ["Интеграция", "Облако, локальное ПО 1С"],
          ["Предел взвешивания", "до 1500 кг"],
        ],
        includes: ["Датчики", "Шкаф управления", "Программное обеспечение"],
      },
    },
    {
      slug: "vesy-ovets-wl101",
      name: "ZOETIS WL101 для овец",
      shortDescription: "Весы для овец и коз · автоучёт",
      description: "Автоматические весы с RFID для учета поголовья овец и коз.",
      price: 850000,
      order: 1,
      specs: {
        animal: "Овцы, козы",
        capacity: "до 200 кг",
        table: [
          ["Технология", "RFID + весовой датчик"],
          ["Точность", "±30 кг"],
          ["Автоучёт", "да"],
          ["Облако", "Мобильное приложение"],
        ],
        includes: ["Весовая платформа", "Ридер RFID", "ПО облако"],
      },
    },
    {
      slug: "vesy-svini-agriwel",
      name: "AgriWel для свиней",
      shortDescription: "Групповое взвешивание свиней",
      description: "Система для стайного взвешивания свиней с облачным хранилищем данных.",
      price: 950000,
      order: 2,
      specs: {
        animal: "Свиньи",
        type: "групповое",
        table: [
          ["Система", "Облачная аналитика"],
          ["Точность взвешивания", "±100 кг"],
          ["Мониторинг", "рост/прирост в реальном времени"],
        ],
        includes: ["Весовая платформа", "Облачный сервис год"],
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
  } else if (!doc.isActive || doc.name !== row.name || doc.description !== row.description || doc.image !== row.image || doc.order !== row.order) {
    await Category.findByIdAndUpdate(doc._id, {
      name: row.name,
      description: row.description,
      image: row.image,
      isActive: true,
      order: row.order,
    });
    // eslint-disable-next-line no-console
    console.log(`  ~ category updated: ${row.slug}`);
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
  } else if (!doc.isActive || doc.name !== row.name || doc.description !== (row.description || "") || doc.image !== (row.image || "") || doc.order !== row.order || String(doc.category) !== String(categoryId)) {
    await Subcategory.findByIdAndUpdate(doc._id, {
      category: categoryId,
      name: row.name,
      description: row.description || "",
      image: row.image || "",
      isActive: true,
      order: row.order,
    });
    // eslint-disable-next-line no-console
    console.log(`    ~ subcategory updated: ${row.slug}`);
  }
  return doc;
}

async function ensureProduct(categoryId, subcategoryId, row) {
  const exists = await Product.findOne({ slug: row.slug });
  if (exists) {
    if (!exists.isActive || exists.category.toString() !== categoryId.toString() || exists.subcategory.toString() !== subcategoryId.toString()) {
      await Product.findByIdAndUpdate(exists._id, {
        category: categoryId,
        subcategory: subcategoryId,
        name: row.name,
        sku: row.slug,
        shortDescription: row.shortDescription || "",
        description: row.description || "",
        price: row.price ?? 0,
        currency: "KZT",
        specs: row.specs || {},
        isActive: true,
        inStock: true,
        order: row.order ?? 0,
      });
      // eslint-disable-next-line no-console
      console.log(`      ~ product updated: ${row.slug}`);
    }
    return;
  }
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

  const equipmentCat = await Category.findOne({ slug: "oborudovanie" });
  if (equipmentCat) {
    // eslint-disable-next-line no-console
    console.log("Seeding оборудование: подкатегории и товары...");
    for (const subRow of EQUIPMENT_SUBS) {
      const sub = await ensureSubcategory(equipmentCat._id, subRow);
      const products = EQUIPMENT_PRODUCTS[subRow.slug] || [];
      for (const p of products) {
        await ensureProduct(equipmentCat._id, sub._id, p);
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
