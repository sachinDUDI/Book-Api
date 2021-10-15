require("dotenv").config();
//frame work
const express = require("express");

const mongoose = require("mongoose");
// database importing
const database = require("./database");

//Models
const BookModel = require("./book1");
const AuthorModel = require("./author1");
const PublicationModel = require("./publication1")
// initialisation
const booky = express();

//configuration
booky.use(express.json());  //if we dont do this then terminal doest identifiy which type of data it is and shows undefined 

//Establish Dtabase connection
mongoose.connect(process.env.MONGO_URL
   
).then(() => console.log("connection established"));
/*
Route          /
Description    get all books
Access         PUBLIC
Parameter      NONE
Methods        GET
*/

booky.get("/", async (req, res) => {
    const getAllBooks = await BookModel.find();
    console.log(getAllBooks)
    return res.json(getAllBooks);
});

/*
Route          /is
Description    get specefic books based on ISBN
Access         PUBLIC
Parameter      isbn
Methods        GET
*/
booky.get("/is/:isbn", async (req, res) => {
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});
    //null --> false, if isbn not match mongo db will not return empty array it will return null 
    if (!getSpecificBook){
        return res.json({
            error:`no book found for the isbn of ${req.params.isbn}`,
        });
    }
    return res.json({book:getSpecificBook });

});
/*
Route          /c
Description    get specific books based on category
Access         PUBLIC
Parameter      category
Methods        GET
*/
booky.get("/c/:category", async (req, res) =>{
    const getSpecificCBook = await BookModel.findOne({category: req.params.category}); 

    if (!getSpecificCBook){
        return res.json({
            error:`no book found for the category of ${req.params.category}`,
        });
    }
    return res.json({book:getSpecificCBook });

});
/*
Route          /lng
Description    get specific books based on language
Access         PUBLIC
Parameter      bhasha
Methods        GET
*/
booky.get("/lng/:bhasha",(req,res) =>{
    const getSpecificlBook = database.books.filter(
    (book) => book.language === req.params.bhasha
    );
    if (getSpecificlBook.length === 0){
        return res.json({
            error:`no book found for the category of ${req.params.bhasha}`,
        });
    }
    return res.json({book:getSpecificlBook });

});


/*
Route          /authors
Description    get all authors
Access         PUBLIC
Parameter      NONE
Methods        GET
*/

booky.get("/authors", async (req, res) =>{
    const getAllAuthors = await AuthorModel.find();
    return res.json({ authors: getAllAuthors});
});

/*
Route          /authors/id
Description    to get specific author 
Access         PUBLIC
Parameter      id
Methods        GET
*/

booky.get("/authors/id/:id", (req, res) =>{
    const getSpecificAuthor = database.author.filter(
        (author) => author.id === parseInt(req.params.id)
     );
     if (getSpecificAuthor.length === 0){
         return res.json({
             error:`no author found for the id of ${req.params.id}`,
         });
     }
     return res.json({author:getSpecificAuthor });
 

});
/*
Route          /authors/book
Description    to get list of author based on books
Access         PUBLIC
Parameter      isbn
Methods        GET
*/
booky.get("/author/book/:isbn", (req, res) => {
    const getSpecificAuthor = database.author.filter((author) => 
    author.books.includes(req.params.isbn)
    );
    if (getSpecificAuthor.length === 0){
        return res.json({
            error:`no author found for the booky of ${req.params.isbn}`,
        });
    }
    return res.json({authors:getSpecificAuthor });

});

/*
Route          /pub
Description    to get all publication 
Access         PUBLIC
Parameter      NONE
Methods        GET
*/
booky.get("/pub", (req, res) =>{
    return res.json({ pub: database.publication});
});

/*
Route          book/add
Description    add new book
Access         PUBLIC
Parameter      NONE
Methods        POST
*/

booky.post("/book/add", async (req, res) =>{
    const {newBook} = req.body;
    await BookModel.create(newBook);
    return res.json({message:"book was added"});
});
/*
Route          author/add
Description    add new authors
Access         PUBLIC
Parameter      NONE
Methods        POST
*/
booky.post("/author/add", (req,res) =>{
    const {newAuthor} = req.body;
    AuthorModel.create(newAuthor);
    return res.json({message:"author was added"});

});

/*
Route          pub/add
Description    add new pub
Access         PUBLIC
Parameter      NONE
Methods        POST
*/

booky.post("/pub/add", (req,res) =>{
    const {newPub} = req.body;
    PublicationModel.create(newPub);
    return res.json({message:"publication was added"});

});

/*
Route          book/update/tittle
Description    Update book tittle
Access         PUBLIC
Parameter      isbn
Methods        PUT
*/ 
 // we can use map also instead foreach but the map will creae a whole object again but foreach would be directly change the original database with updating only the value you passed
 //although data won't be changed imidiaste it in RAM
booky.put("/book/update/title/:isbn", async (req, res) =>{
    const updatedBook = await BookModel.findOneAndUpdate(
        {ISBN: req.params.isbn,},
        {tittle: req.body.newBookTitle,},
        {new: true,} // to get updated database
    );
    
    return res.json({ books:  updatedBook });
});

/*
Route          book/update/author
Description    Update book author
Access         PUBLIC
Parameter      NONE
Methods        PUT
*/ 

booky.put("/book/update/author/:isbn/:authorId", async (req, res) => {
    //update book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {ISBN: req.params.isbn },
        { $addToSet:{
            authors: parseInt(req.body.authorId),
        },
        },
        {new: true}
    );
    //update author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {id: parseInt(req.params.authorId) },
        { $addToSet:{
            books: req.body.newbookN,
        },
        },
        {new: true}
    );
   
    return res.json({ books: updatedBook, author:updatedAuthor });
});

/*
Route          /author/update
Description    Update author name
Access         PUBLIC
Parameter      authorId
Methods        PUT
*/ 
booky.put("/author/update/:authorId", (req, res) =>{
    database.author.forEach((authorn) => {              
        if (authorn.id === parseInt(req.params.authorId)) {
            authorn.name = req.body.newAname;
            return;
        }
    });
    return res.json({ authorn: database.author });
});


/*
Route          /publication/update/name
Description    Update publication name
Access         PUBLIC
Parameter      pubId
Methods        PUT
*/ 
booky.put("/publication/update/name/:pubId", (req, res) =>{
    database.publication.forEach((pubn) => {              
        if (pubn.id === parseInt(req.params.pubId)) {
            pubn.name = req.body.newPubname;
            return;
        }
    });
    return res.json({ pubn: database.publication });
});


/*
Route          /publication/update/book
Description    Update/add new book to a publication
Access         PUBLIC
Parameter      isbn
Methods        PUT
*/ 
booky.put("/publication/update/book/:isbn", (req, res) =>{
    //update the publication database
    database.publication.forEach((publication)=>{
        if (publication.id === req.body.pubId) {
            return publication.books.push(req.body.bookName);

        }
    });
    //update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.publication = req.body.pubId;
            return;
        }
    });
    return res.json({
        books: database.books,
        publications: database.publication,

    });
});

/*
Route          /book/delete
Description    delete a book
Access         PUBLIC
Parameter      isbn
Methods        DELETE
*/ 
booky.delete("/book/delete/:isbn", async (req, res) =>{
    const updatedBookDatabase = await BookModel.findOneAndDelete(
        {ISBN:req.params.isbn,}
        );
   
    return res.json({ books:updatedBookDatabase});


});

/*
Route          /book/delete/author
Description    delete a author from book
Access         PUBLIC
Parameter      isbn , author id
Methods        DELETE
*/ 
booky.delete("/book/delete/author/:isbn/:authorId",async (req, res)=>{
    // update the book database
    const newAuthorList = await BookModel.findOneAndUpdate(
        {ISBN : req.params.isbn},
        {$pull:
            {authors : parseInt(req.params.authorId)},
        },
        {new: true}
        ); 
    
    // update the author database
    const newBookList = await AuthorModel.findOneAndUpdate(
        {id : parseInt(req.params.authorId)},
        {$pull:
            { books : req.body.DelName},
        },
        {new: true}
        ); 
    
    return res.json ({book:  newAuthorList, author: newBookList});
});

/*
Route          /author/delete
Description    delete a book
Access         PUBLIC
Parameter      aId
Methods        DELETE
*/ 
booky.delete("/author/delete/:aId", (req, res) =>{
    const updatedAuthorDatabase = database.author.filter(
        (auth)=> auth.id !== parseInt(req.params.aId)
    ); //filter will return new array
    database.author = updatedAuthorDatabase;
    return res.json({ books: database.author});


});

/*
Route          /publication/delete/book
Description    delete a book from pulication
Access         PUBLIC
Parameter      isbn , publication id
Methods        DELETE
*/ 
booky.delete("/publication/delete/book/:isbn/:pubId",(req , res) =>{
    // update pulication databse
    database.publication.forEach((publication)=> {
        if (publication.id === parseInt(req.params.pubId)){
            const newBookList = publication.books.filter(
                (book)=> book !== req.body.Dname
            );
            publication.books = newBookList;
            return;
        }
    });
    //update book database
    database.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn){
            book.publication = 0; // no publication available
            return;
        }
    });

    return res.json({books: database.books , publication: database.publication});
});


booky.listen(3000, () => console.log("server is working"));

//How does the server serves the request