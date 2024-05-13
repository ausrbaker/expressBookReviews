const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } else{
    return res.status(404).json({message: "Unable to register user."});
  }
//  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    try {
    // Stringify the books object and send it as JSON response
    const booksJSON = JSON.stringify(books);
    return res.status(200).json(booksJSON);
  } catch (error) {
    console.error("Error parsing file:", error);
    return res.status(500).json({ error: "Internal Error" });
  }
//  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn); // Convert ISBN to integer
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];
    return res.status(200).json({ book });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
//    return res.status(300).json({message: "Yet to be implemented"});
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const providedAuthor = req.params.author; // Get the provided author from request parameters
  const matchingBooks = []; // Array to store matching books

  // Iterate through each key in the books object
  for (const key in books) {
    const book = books[key]; 
    if (book.author === providedAuthor) {
      matchingBooks.push(book); 
    }
  }
  if (matchingBooks.length > 0) {
    return res.status(200).json({ books: matchingBooks });
  } else {
    return res.status(404).json({ message: "No books found for the provided author" });
  }
//  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const providedTitle = req.params.title; // Get the provided author from request parameters
  const matchingBooks = []; // Array to store matching books

  // Iterate through each key in the books object
  for (const key in books) {
    const book = books[key]; 
    if (book.title === providedTitle) {
      matchingBooks.push(book); 
    }
  }
  if (matchingBooks.length > 0) {
    return res.status(200).json({ books: matchingBooks });
  } else {
    return res.status(404).json({ message: "No books found for the provided author" });
  }
//  return res.status(300).json({message: "Yet to be implemented"});
});
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books.hasOwnProperty(isbn)) {
    const bookReviews = books[isbn].reviews;
    return res.status(200).json(bookReviews);
  } else {
    return res.status(404).json({ error: "Book not found" });
  }  
//  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
