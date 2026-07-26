import Product from "../models/productModel.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 500;
    const products = await Product.find({}).limit(limit);
    res.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
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
      image,
      images,
      isFeatured,
      isPublished,
      tags,
    } = req.body;

    let formattedImages = [];
    if (images && Array.isArray(images)) {
      formattedImages = images.map((img) =>
        typeof img === "string" ? { url: img } : img,
      );
    } else if (image) {
      formattedImages = [{ url: image }];
    }

    const product = new Product({
      name,
      price,
      discountPrice,
      countInStock: countInStock || 0,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images: formattedImages,
      isFeatured: isFeatured ?? false,
      isPublished: isPublished ?? false,
      tags,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to create product" });
  }
};

// @desc    Update a product (Edit)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
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
      image,
      images,
      isFeatured,
      isPublished,
      tags,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Format images properly for updates as well
    let formattedImages = product.images; // keep existing if none provided
    if (images && Array.isArray(images)) {
      formattedImages = images.map((img) =>
        typeof img === "string" ? { url: img } : img,
      );
    } else if (image) {
      formattedImages = [{ url: image }];
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.discountPrice = discountPrice ?? product.discountPrice;
    product.countInStock = countInStock ?? product.countInStock;
    product.sku = sku ?? product.sku;
    product.category = category ?? product.category;
    product.brand = brand ?? product.brand;
    product.sizes = sizes ?? product.sizes;
    product.colors = colors ?? product.colors;
    product.collections = collections ?? product.collections;
    product.material = material ?? product.material;
    product.gender = gender ?? product.gender;
    product.images = formattedImages;
    product.isFeatured = isFeatured ?? product.isFeatured;
    product.isPublished = isPublished ?? product.isPublished;
    product.tags = tags ?? product.tags;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to update product" });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Search products by query keyword
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.json({ products: [] });
    }

    // Case-insensitive regex search matching name, category, brand, or tags
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    }).limit(10);

    // Mapped safely to match what your SearchBar frontend expects
    const formattedProducts = products.map((item) => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      category: item.category,
      image: item.images?.[0]?.url || item.images?.[0] || "",
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Server Error during search" });
  }
};



export { getProducts, createProduct, updateProduct, deleteProduct, searchProducts };
