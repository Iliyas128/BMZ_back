const mongoose = require('mongoose');
const { assertMongoUri } = require('./config/env');

async function main() {
  const { mongoUri } = assertMongoUri();
  await mongoose.connect(mongoUri);

  const slugs = ['fundament', 'avtomatizatsiya', 'oborudovanie', 'uslugi'];
  const db = mongoose.connection.db;

  const categories = await db.collection('categories').find({ slug: { $in: slugs } }).toArray();
  console.log('Found categories:', categories.map((c) => ({ slug: c.slug, _id: c._id.toString() })));
  if (categories.length === 0) {
    console.log('No categories found for deletion.');
    await mongoose.disconnect();
    return;
  }

  const categoryIds = categories.map((c) => c._id);
  const deletedCategories = await db.collection('categories').deleteMany({ _id: { $in: categoryIds } });
  const deletedSubcategories = await db.collection('subcategories').deleteMany({ category: { $in: categoryIds } });
  const deletedProducts = await db.collection('products').deleteMany({ category: { $in: categoryIds } });

  console.log('Deleted counts:', {
    categories: deletedCategories.deletedCount,
    subcategories: deletedSubcategories.deletedCount,
    products: deletedProducts.deletedCount,
  });
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
