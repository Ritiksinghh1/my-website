const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const products = [
  {
    name: "iPhone 15 Pro",
    description: "Latest Apple smartphone with A17 chip",
    price: 79999,
    category: "Electronics",
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1696446702183-cbd13e6e1833?w=400",
    countInStock: 25,
    isFeatured: true,
    rating: 4.8,
    numReviews: 120,
  },
  {
    name: "Samsung 4K Smart TV",
    description: "55 inch 4K UHD Smart TV with HDR",
    price: 54999,
    category: "Electronics",
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400",
    countInStock: 10,
    isFeatured: true,
    rating: 4.5,
    numReviews: 89,
  },
  {
    name: "Nike Air Max 270",
    description: "Comfortable running shoes with Air Max cushioning",
    price: 8999,
    category: "Sports",
    brand: "Nike",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    countInStock: 50,
    isFeatured: true,
    rating: 4.6,
    numReviews: 200,
  },
  {
    name: "Men's Casual T-Shirt",
    description: "100% cotton comfortable daily wear t-shirt",
    price: 599,
    category: "Clothing",
    brand: "H&M",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    countInStock: 100,
    isFeatured: false,
    rating: 4.2,
    numReviews: 45,
  },
  {
    name: "The Alchemist",
    description: "Bestselling novel by Paulo Coelho",
    price: 299,
    category: "Books",
    brand: "HarperCollins",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    countInStock: 75,
    isFeatured: false,
    rating: 4.9,
    numReviews: 500,
  },
  {
    name: "Instant Pot Duo",
    description: "7-in-1 electric pressure cooker, 6 quart",
    price: 6999,
    category: "Home & Kitchen",
    brand: "Instant Pot",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400",
    countInStock: 30,
    isFeatured: true,
    rating: 4.7,
    numReviews: 312,
  },
];

const seed = async () => {
  await Product.deleteMany();
  await Product.insertMany(products);
  console.log("✅ 6 products seeded!");
  process.exit();
};

seed();