const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// Add Product to Wishlist (Protected)
const addToWishlist = async (req, res) => {
  try {
    const productId = req.body.productId || req.body.product;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find and update the wishlist, or create it if not existing
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        products: [productId],
      });
    } else {
      // Use findOneAndUpdate to prevent race conditions and utilize $addToSet to avoid duplicates
      wishlist = await Wishlist.findOneAndUpdate(
        { user: userId },
        { $addToSet: { products: productId } },
        { new: true }
      );
    }

    await wishlist.populate("products", "title price images brand stock");
    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove Product from Wishlist (Protected)
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $pull: { products: productId } },
      { new: true }
    ).populate("products", "title price images brand stock");

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Wishlist (Protected)
const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    let wishlist = await Wishlist.findOne({ user: userId })
      .populate("products", "title price images brand stock");

    if (!wishlist) {
      // Return a clean mock wishlist structure if the user hasn't favorited anything yet
      return res.status(200).json({ user: userId, products: [] });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};
