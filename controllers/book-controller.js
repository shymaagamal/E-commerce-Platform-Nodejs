import {Book} from '../models/book-model.js';
import {asyncWrapper} from '../utils/async-wrapper.js';
import httpStatusText from '../utils/http-status-text.js';

// GET all books with pagination and filtering
// If No Filter Provided Will Fetch All Books
export const getBooks = asyncWrapper(async (req, res) => {
  const {title, author, page = 1, limit = 10} = req.query;
  const query = {};

  // Add case-insensitive filters for title and author if provided
  if (title) query.title = new RegExp(title, 'i');
  if (author) query.author = new RegExp(author, 'i');

  // Fetch books from the database with pagination
  const books = await Book.find(query)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  // Check if no books were found
  if (books.length === 0) {
    return res.status(404).json({status: httpStatusText.FAIL, message: 'No books found matching the provided filters.'});
  }

  // Send a success response with the fetched books
  res.status(200).json({status: httpStatusText.SUCCESS, books});
});

// GET single book by ID
export const getBookById = asyncWrapper(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({status: httpStatusText.FAIL, message: 'Book not found'});
  }
  res.status(200).json({status: httpStatusText.SUCCESS, book});
});

// CREATE a new book (Admin only)
export const createBook = asyncWrapper(async (req, res) => {
  const {title, author, price, description, stock, image} = req.body;

  const book = await Book.create({title, author, price, description, stock, image});
  res.status(201).json({status: httpStatusText.SUCCESS, book});
});

// UPDATE a book (Admin only)
export const updateBook = asyncWrapper(async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body);

  if (!book) {
    return res.status(404).json({status: httpStatusText.FAIL, message: 'Book not found'});
  }

  res.status(200).json({status: httpStatusText.SUCCESS, book});
});

// DELETE a book (Admin only)
export const deleteBook = asyncWrapper(async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) {
    return res.status(404).json({status: httpStatusText.FAIL, message: 'Book not found'});
  }

  res.status(200).json({status: httpStatusText.SUCCESS, message: 'Book deleted successfully'});
});
