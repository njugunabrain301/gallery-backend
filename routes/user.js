const express = require("express");
const Collection = require("../models/Collection");

const router = express.Router();

// Get all collections
router.get("/get-collections", async (req, res) => {
  try {
    const collections = await Collection.find();
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/get-collection/:id", async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /admin/collections/{type}:
 *   get:
 *     tags: [Collections]
 *     summary: Get collections by type
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: The collection type to filter by
 *     responses:
 *       200:
 *         description: List of collections of specified type
 *       500:
 *         description: Server error
 */
router.get("/get-collections/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const collections = await Collection.find({
      type: { $regex: new RegExp(type, "i") },
    });

    if (!collections.length) {
      return res.status(404).json({
        message: `No collections found of type: ${type}`,
      });
    }

    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /user/collections:
 *   get:
 *     tags: [Collections]
 *     summary: Get all collections with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Optional filter by collection type
 *     responses:
 *       200:
 *         description: Paginated list of collections
 *       500:
 *         description: Server error
 */
router.get("/collections", async (req, res) => {
  try {
    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.type) {
      filter.type = { $regex: new RegExp(req.query.type, "i") };
    }

    // Execute queries
    const collections = await Collection.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ dateCreated: -1 });

    const totalCollections = await Collection.countDocuments(filter);
    const totalPages = Math.ceil(totalCollections / limit);

    res.json({
      collections,
      pagination: {
        totalCollections,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /user/collections/{type}:
 *   get:
 *     tags: [Collections]
 *     summary: Get collections by type with pagination
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: The collection type to filter by
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated list of collections by type
 *       404:
 *         description: No collections found of specified type
 *       500:
 *         description: Server error
 */
router.get("/collections/:type", async (req, res) => {
  try {
    // Get type from path params
    const { type } = req.params;

    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter with case-insensitive type matching
    const filter = { type: { $regex: new RegExp(type, "i") } };

    // Execute queries
    const collections = await Collection.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ dateCreated: -1 });

    const totalCollections = await Collection.countDocuments(filter);

    if (totalCollections === 0) {
      return res.status(404).json({
        message: `No collections found of type: ${type}`,
      });
    }

    const totalPages = Math.ceil(totalCollections / limit);

    res.json({
      collections,
      pagination: {
        totalCollections,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /user/collection/{id}:
 *   get:
 *     tags: [Collections]
 *     summary: Get collection by ID with paginated gallery images
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The collection ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for images
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of images per page
 *     responses:
 *       200:
 *         description: Collection with paginated gallery images
 *       404:
 *         description: Collection not found
 *       500:
 *         description: Server error
 */
router.get("/collection/:id", async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // Parse pagination parameters for images
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Get total count of images
    const totalImages = collection.picturesArray
      ? collection.picturesArray.length
      : 0;
    const totalPages = Math.ceil(totalImages / limit);

    // Get paginated subset of images
    const paginatedImages = collection.picturesArray
      ? collection.picturesArray.slice(startIndex, endIndex)
      : [];

    // Create a copy of the collection object to modify
    const result = collection.toObject();

    // Replace the full picturesArray with the paginated subset
    result.picturesArray = paginatedImages;

    // Add pagination metadata
    res.json({
      collection: result,
      pagination: {
        totalImages,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
