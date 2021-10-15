const mongoose = require("mongoose");

// Creating a book schema
const BookSchema = mongoose.Schema({
    ISBN: {
        type : String,
        require : true,
        minLength : 6,
        maxLength : 8
    },
    tittle: {
        type : String,
        require : true,
    },
    pubDate: String,
    language : String,
    numPage: Number,
    authors: [Number],
    publication:[Number],
    category: [String],
});

//Create a book model
const BookModel = mongoose.model("books",BookSchema);
module.exports = BookModel;