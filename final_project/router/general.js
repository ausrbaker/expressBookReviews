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
  const getBooksInfo = new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(books);
      }, 2000); // delay of 2 seconds
    } catch (error) {reject(error);}
  });
  getBooksInfo
    .then((booksinfo) => {
      const booksJSON = JSON.stringify(booksinfo);
      res.status(200).json(booksJSON);
    })
    .catch((error) => {
      console.error("Error parsing file:", error);
      res.status(500).json({ error: "Internal Error" });
    });

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; 
  const getBooksInfo = new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(books);
      }, 2000); //  delay of 2 seconds
    } catch (error) {
      reject(error);
    }
  });
  getBooksInfo.then((booksInfo) => {
    if (booksInfo.hasOwnProperty(isbn)) {
      const book = booksInfo[isbn];
      return res.status(200).json({ book });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  })
  .catch((error) => {
    console.error("Error parsing file:", error);
    res.status(500).json({ error: "Internal Error" });
  });

});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const providedAuthor = req.params.author; // Get the provided author from request parameters
  const booksFound = []; // Array to store matching books
  const getBooksInfo = new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(books);
      }, 2000); //  delay of 2 seconds
    } catch (error) {
      reject(error);
    }
  });  
  getBooksInfo.then((booksInfo) => {
  // Iterate through each key in the books object
    for (const key in booksInfo) {
      const book = booksInfo[key]; 
      if (book.author === providedAuthor) {
        booksFound.push(book); 
      }
    }
    if (booksFound.length > 0) {
      return res.status(200).json({ books: booksFound });
    } else {
      return res.status(404).json({ message: "No books for that author" });
    }
  })
  .catch((error) => {
    console.error("Error getting file:", error);
    res.status(500).json({ error: " Error" });
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const bookTitle = req.params.title; // Get the provided author from request parameters
  const booksFound = []; // Array to store matching books
  const getBooksInfo = new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(books);
      }, 2000); // Simulating a delay of 1 second
    } catch (error) {
      reject(error);
    }
  });
  getBooksInfo.then((booksInfo) => {
    for (const key in booksInfo) {
      const book = booksInfo[key]; 
      if (book.title === bookTitle) {
        booksFound.push(book); 
      }
    }
    if (booksFound.length > 0) {
      return res.status(200).json({ books: booksFound });
    } else {
      return res.status(404).json({ message: "No books found for the provided author" });
    }
  }.catch(() => {
    console.error("Error parsing file:", error);
    res.status(500).json({ error: "Internal Error" });
  });
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
