const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  picturesArray: [
    {
      type: String, // URLs to stored images
    },
  ],
  type: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Collection = mongoose.model("Collection", CollectionSchema);
module.exports = Collection;
