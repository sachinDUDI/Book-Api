const mongoose = require("mongoose");

// Creating a publication schema
const PublicationSchema = mongoose.Schema({
  id: Number,
  name: String,
  books: [String],
});

//Create a publication model
const PublicationModel = mongoose.model("publications",PublicationSchema);
module.exports = PublicationModel;