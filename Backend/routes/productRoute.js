import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper function to safely normalize image data into schema format: [{ url: "..." }]
const formatImagesInput = (images, image) => {
  if (images) {
    if (Array.isArray(images)) {
      return images.map((img) =>
        typeof img === "string" ? { url: img } : img,
      );
    } else if (typeof images === "string") {
      return [{ url: images }];
    }
  }
  if (image) {
    return [{ url: image }];
  }
  return undefined;
};

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, search, and pagination
// @access  Public
router.get("/", async (req, res) => {
  try {
    const {
      collection,
      category,
      gender,
      size,
      color,
      minPrice,
      maxPrice,
      sortBy,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    let query = { isPublished: true }; // Only show published products by default

    // Filtering logic
    if (collection && collection.toLowerCase() !== "all") {
      query.collections = collection;
    }
    if (category && category.toLowerCase() !== "all") {
      query.category = category;
    }
    if (gender) {
      query.gender = gender;
    }
    if (size) {
      query.sizes = size;
    }
    if (color) {
      query.colors = color;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search filter (searches name and tags safely)
    if (search) {
      const sanitizedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape regex chars
      query.$or = [
        { name: { $regex: sanitizedSearch, $options: "i" } },
        { tags: { $in: [new RegExp(sanitizedSearch, "i")] } },
      ];
    }

    // Sorting logic
    let sortOption = { createdAt: -1 }; // Default: newest
    if (sortBy === "price-asc") sortOption = { price: 1 };
    if (sortBy === "price-desc") sortOption = { price: -1 };
    if (sortBy === "rating") sortOption = { rating: -1 };

    // Pagination bounds protection
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Math.min(100, Number(limit))); // Cap limit at 100 for safety
    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const totalProducts = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(totalProducts / limitNumber),
      currentPage: pageNumber,
      totalProducts,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/products/:id
// @desc    Get a single product by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    const product = await Product.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("Error fetching single product:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/products
// @desc    Create a new product (Admin)
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      image,
      isFeatured,
      isPublished,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      dimensions,
      weight,
    } = req.body;

    const formattedImages = formatImagesInput(images, image);

    const newProduct = new Product({
      name,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images: formattedImages,
      isFeatured,
      isPublished,
      tags,
      user: req.user._id, // Automatically uses the logged-in admin's ID
      metaTitle,
      metaDescription,
      metaKeywords,
      dimensions,
      weight,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(400).json({ message: err.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Admin)
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    const updateData = { ...req.body };
    const formattedImages = formatImagesInput(req.body.images, req.body.image);

    if (formattedImages) {
      updateData.images = formattedImages;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin)
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
