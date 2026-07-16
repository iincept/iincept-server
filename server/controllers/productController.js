const Product = require("../models/Product");
const Category = require("../models/Category");

// Helper to generate slugs
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

// Add Product (Admin only)
const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discountPrice,
      images,
      category,
      brand,
      stock,
      sizes,
      colors,
      storage,
      ram,
      material,
      features,
      rating,
      variants,
    } = req.body;

    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Category does not exist" });
    }

    const slug = slugify(title);

    const product = await Product.create({
      title,
      slug,
      description,
      price,
      discountPrice,
      images,
      category,
      brand,
      stock,
      sizes,
      colors,
      storage,
      ram,
      material,
      features,
      rating,
      variants,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      title,
      description,
      price,
      discountPrice,
      images,
      category,
      brand,
      stock,
      sizes,
      colors,
      storage,
      ram,
      material,
      features,
      rating,
      variants,
    } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If category is changing, validate it exists
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Category does not exist" });
      }
      product.category = category;
    }

    if (title) {
      product.title = title;
      product.slug = slugify(title);
    }
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (images) product.images = images;
    if (brand) product.brand = brand;
    const oldStock = product.stock;
    const isStockChanged = stock !== undefined && Number(stock) !== oldStock;

    if (stock !== undefined) product.stock = Number(stock);
    if (sizes) product.sizes = sizes;
    if (colors) product.colors = colors;
    if (storage) product.storage = storage;
    if (ram) product.ram = ram;
    if (material) product.material = material;
    if (features) product.features = features;
    if (rating !== undefined) product.rating = rating;
    if (variants !== undefined) product.variants = variants;

    const updatedProduct = await product.save();

    if (isStockChanged) {
      try {
        const StockHistory = require("../models/StockHistory");
        await StockHistory.create({
          product: productId,
          oldStock,
          newStock: updatedProduct.stock,
          changeReason: "Restocked by Admin",
          updatedBy: req.user._id
        });
      } catch (historyErr) {
        console.error("Failed to log product stock change:", historyErr);
      }
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Products (Public)
const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sortBy, order } = req.query;
    let query = {};

    // 1. Search Filter (title or description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // 2. Category Filter (slug or ObjectId)
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        const mongoose = require("mongoose");
        if (mongoose.Types.ObjectId.isValid(category)) {
          query.category = category;
        } else {
          // If category filter is invalid, return empty list
          return res.status(200).json([]);
        }
      }
    }

    // 3. Price Filter (minPrice/maxPrice)
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // 4. Sorting
    let sort = {};
    if (sortBy) {
      const sortOrder = order === "asc" ? 1 : -1;
      sort[sortBy] = sortOrder;
    } else {
      sort.createdAt = -1; // Default
    }

    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort(sort);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Product by ID (Public)
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const mongoose = require("mongoose");
    let product;

    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId).populate("category", "name slug");
    } else {
      // Mock ID map to standard database product titles
      const mockIdMap = {
        'ip17pm': 'iPhone 17 Pro Max',
        'ip17p': 'iPhone 17 Pro',
        'ipair': 'iPhone Air',
        'ip17': 'iPhone 17',
        'ip16pm': 'iPhone 17e',
        'ip16p': 'iPhone 16 Pro',
        'ip16plus': 'iPhone 16 Plus',
        'ip16': 'iPhone 16',
        'ip15pm': 'iPhone 15 Pro Max',
        'ip15p': 'iPhone 15 Pro',
        'ip15': 'iPhone 15',
        'mbneo': 'MacBook Neo 14-inch',
        'mbp16m4': 'MacBook Pro 16-inch (M4 Max)',
        'mbp14m4': 'MacBook Pro 14-inch (M4 Pro)',
        'mba15m3': 'MacBook Air 15-inch (M3)',
        'mba13m3': 'MacBook Air 13-inch (M3)',
        'mbp16m3': 'MacBook Pro 16-inch (M3 Max)',
        'mbp14m3': 'MacBook Pro 14-inch (M3 Pro)',
        'mba13m2': 'MacBook Air 13-inch (M2)',
        'mbp13m2': 'MacBook Pro 13-inch (M2)',
        'ipadpro13m4': 'iPad Pro 13-inch (M4)',
        'ipadpro11m4': 'iPad Pro 11-inch (M4)',
        'ipadair13m4': 'iPad Air 13-inch (M4)',
        'ipadair11m4': 'iPad Air 11-inch (M4)',
        'ipad10th': 'iPad 10.9-inch (10th Gen)',
        'ipadminia17': 'iPad mini (A17 Pro)',
        'ipadpro12m2': 'iPad Pro 12.9-inch (M2)',
        'awultra2': 'Apple Watch Ultra 2',
        'awseries10': 'Apple Watch Series 10',
        'awse': 'Apple Watch SE',
        'awhermes10': 'Apple Watch Hermès Series 10',
        'apmaxusbc': 'AirPods Max (USB-C)',
        'appro2': 'AirPods Pro 2',
        'ap4anc': 'AirPods 4 (with ANC)',
        'ap4': 'AirPods 4',
        'apmaxlightning': 'AirPods Max (Lightning)',
        'appletv4k': 'Apple TV 4K',
        'homepod2': 'HomePod (2nd Gen)',
        'homepodmini': 'HomePod mini',
        'homepod1': 'HomePod (1st Gen)',
        'belkin3in1': 'Belkin UltraCharge Pro 3-in-1 Magnetic Charging Dock',
        'herschelsling': 'Herschel Cloud Sling for iPhone',
        'herscheltote': 'Herschel AirPods Tote Bag Charm'
      };

      const title = mockIdMap[productId];
      if (title) {
        product = await Product.findOne({ title }).populate("category", "name slug");
      }
      
      if (!product) {
        // Fallback: try searching case-insensitively by title using slugified mock ID
        const slug = productId.replace(/[_-]/g, ' ');
        product = await Product.findOne({ title: { $regex: new RegExp(slug, 'i') } }).populate("category", "name slug");
      }
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Stock History (Admin only)
const adminGetStockHistory = async (req, res) => {
  try {
    const StockHistory = require("../models/StockHistory");
    const logs = await StockHistory.find({})
      .populate("product", "title price brand images")
      .populate("updatedBy", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
  adminGetStockHistory,
};
