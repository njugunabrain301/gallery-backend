const express = require("express");
const { authenticate } = require("../utils/Auth");
const Collection = require("../models/Collection");
const Application = require("../models/Application");
const SendSMS = require("../utils/sendSMS");
const { uploadMultipleFiles } = require("../utils/FileUpload");
const Payment = require("../models/Payment");
const User = require("../models/User");
const router = express.Router();

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user.payload.userType !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// Apply both JWT auth and admin check to all routes
router.use(authenticate, isAdmin);

// Get all collections
router.get("/get-collections", async (req, res) => {
  try {
    const collections = await Collection.find();
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/get-collection/:id ", async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/add-collection", async (req, res) => {
  try {
    const collection = new Collection(req.body);
    await collection.save();
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update-collection/:id", async (req, res) => {
  try {
    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete-collection/:id", async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.json({ message: "Collection deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post(
  "/add-collection-images/:id",
  uploadMultipleFiles(),
  async (req, res) => {
    try {
      const collection = await Collection.findById(req.params.id);
      collection.picturesArray = [
        ...collection.picturesArray,
        ...req.body.fileURLs,
      ];
      await collection.save();
      res.json(collection);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.delete(
  "/delete-collection-image/:collectionId/:imageUrl",
  async (req, res) => {
    try {
      const { collectionId, imageUrl } = req.params;

      // Find the collection and remove the specific image from picturesArray
      const collection = await Collection.findByIdAndUpdate(
        collectionId,
        { $pull: { picturesArray: decodeURIComponent(imageUrl) } },
        { new: true }
      );

      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }

      res.json({
        message: "Image deleted successfully",
        collection,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
