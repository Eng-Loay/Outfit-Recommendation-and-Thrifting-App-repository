const User = require('../models/Usermodel');
const Product = require('../models/Product');

async function seedData() {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) return; // Skip seeding if users exist

    // Dummy users
    const dummyUsers = [
      { fullName: 'Alice Seller', username: 'alice', email: 'alice@example.com', password: 'Password1', number: '1234567890', gender: 'female' },
      { fullName: 'Bob Seller', username: 'bob', email: 'bob@example.com', password: 'Password1', number: '2345678901', gender: 'male' },
      { fullName: 'Carol Seller', username: 'carol', email: 'carol@example.com', password: 'Password1', number: '3456789012', gender: 'female' }
    ];
    const createdUsers = await User.insertMany(dummyUsers);

    // Dummy products
    const dummyProducts = [
      { name: 'Vintage Jeans', category: 'Clothing', colour: 'Blue', price: 30, sellerRating: 4.5, seller: createdUsers[0]._id, buyer: createdUsers[2]._id },
      { name: 'Retro Jacket', category: 'Clothing', colour: 'Brown', price: 50, sellerRating: 4.0, seller: createdUsers[1]._id, buyer: null },
      { name: 'Leather Boots', category: 'Footwear', colour: 'Black', price: 80, sellerRating: 5.0, seller: createdUsers[2]._id, buyer: null },
      { name: 'Silk Scarf', category: 'Accessories', colour: 'Red', price: 20, sellerRating: 3.8, seller: createdUsers[0]._id, buyer: null },
      { name: 'Denim Shirt', category: 'Clothing', colour: 'Light Blue', price: 25, sellerRating: 4.2, seller: createdUsers[1]._id, buyer: createdUsers[0]._id }
    ];
    await Product.insertMany(dummyProducts);

    console.log('✅ Dummy data seeded successfully');
  } catch (err) {
    console.error('❌ Error seeding dummy data:', err);
  }
}

module.exports = seedData;
