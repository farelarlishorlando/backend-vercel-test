import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi MongoDB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ MONGO_URI not found in environment variables");
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Contoh Schema dan Model
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imageUrl: String,
});

const Product = mongoose.model("Product", productSchema);

// Route utama
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Backend berjalan dengan baik di Vercel (ESM)",
  });
});

// Route contoh GET semua produk
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Route contoh POST tambah produk
app.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ message: "Product added successfully", product });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Export app untuk Vercel (tanpa app.listen)
export default app;
