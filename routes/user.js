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

module.exports = router;
