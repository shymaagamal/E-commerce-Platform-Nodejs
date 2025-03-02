import {asyncWrapper} from '../middleware/asyncWrapper.js';
import Book from '../models/book.js';
import httpStatusText from '../utils/httpStatusText.js';

// GET all books with pagination and filtering
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

  // Send a success response with the fetched books
  res.status(200).json({status: httpStatusText.SUCCESS, books});
});
