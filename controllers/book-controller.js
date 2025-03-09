import {validationResult} from 'express-validator';
import {bookModel} from '../models/book-model.js';
import {asyncWrapper} from '../utils/async-wrapper.js';
import {getCache, setCache} from '../utils/cache-service.js';
import httpStatusText from '../utils/http-status-text.js';
import createLogger from '../utils/logger.js';

const bookLogger = createLogger('book-service');

// GET all books with pagination and filtering
// If No Filter Provided Will Fetch All Books
export const getBooks = asyncWrapper(async (req, res) => {
  const {title, author, page = 1, limit = 10} = req.query;
  const query = {};
  // Add case-insensitive filters for title and author if provided
  if (title) query.title = new RegExp(title, 'i');
  if (author) query.author = new RegExp(author, 'i');

  // ==================try to retrive first from cache===========
  const cacheKey = `books-${page}_${limit}_${title}_${author}`;
  const cachedBooks = getCache(cacheKey);
  if (cachedBooks) {
    bookLogger.info(`✅ Cache HIT: Retrieved ${cachedBooks.length} books from Node cache 🏷️ at ${new Date().toISOString()}`);
    return res.status(200).json({status: httpStatusText.SUCCESS, cachedBooks});
  }
  bookLogger.warn(`⚠️ Cache MISS: Fetching books from the database 🗄️ at ${new Date().toISOString()}`);
  // Fetch books from the database with pagination
  const books = await bookModel.find(query)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  // Check if no books were found
  if (books.length === 0) {
    bookLogger.error(`❌ No books found matching the provided filters: ${JSON.stringify(req.query)}`);

    return res.status(404).json({status: httpStatusText.FAIL, message: 'No books found matching the provided filters.'});
  }
  bookLogger.info(`📚 Cache SET: Stored ${books.length} books in cache ⏳ TTL=${3600}s 🕒 at ${new Date().toISOString()}`);

  setCache(cacheKey, books);
  // Send a success response with the fetched books
  res.status(200).json({status: httpStatusText.SUCCESS, books});
});

// GET single book by ID
export const getBookById = asyncWrapper(async (req, res) => {
  const book = await bookModel.findById(req.params.id);
  if (!book) {
    bookLogger.error(`❌ Book not found: The requested book with ID "${req.params.id}" does not exist or has been removed.`);

    return res.status(404).json({status: httpStatusText.FAIL, message: `❌ Book not found: The requested book with ID "${req.params.id}" does not exist or has been removed.`});
  }
  bookLogger.info(`📚 Book sent successfully: Book with ID "${req.params.id}" was retrieved and sent to the user.`);

  res.status(200).json({status: httpStatusText.SUCCESS, book});
});

// CREATE a new book (Admin only)
export const createBook = asyncWrapper(async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    bookLogger.error('New data doesn\'t follow schema');
    return res.status(400).json({status: httpStatusText.FAIL, data: error});
  }
  const {title, author, isbn, price, description, stock} = req.body;

  const checkISBN = await bookModel.findOne({isbn});
  if (checkISBN) {
    bookLogger.error('⚠️ This book is already exits.');
    const error = new Error('⚠️ This book is already exits.');
    error.status = 400;
    error.httpStatusText = httpStatusText.FAIL;
    return next(error);
  }

  // Cloudinary automatically stores the image and returns a URL
  const coverImage = req.file ? req.file.path : null;

  const book = await bookModel.create({title, author, isbn, price, description, stock, image: coverImage});
  bookLogger.info(`New book created: ${book.title}`);
  res.status(201).json({status: httpStatusText.SUCCESS, book});
});

// UPDATE a book (Admin only)
export const updateBook = asyncWrapper(async (req, res, next) => {
  if (req.body.isbn) {
    bookLogger.error(`⚠️ Unauthorized attempt to modify ISBN detected. The ISBN field is immutable and cannot be changed.`);
    const error = new Error('⚠️ Unauthorized attempt to modify ISBN detected. The ISBN field is immutable and cannot be changed.');
    error.status = 400;
    error.httpStatusText = httpStatusText.FAIL;
    return next(error);
  }
  const book = await bookModel.findByIdAndUpdate(req.params.id, req.body, {new: true});

  if (!book) {
    return res.status(404).json({status: httpStatusText.FAIL, message: 'Book not found'});
  }

  res.status(200).json({status: httpStatusText.SUCCESS, book});
});

// DELETE a book (Admin only)
export const deleteBook = asyncWrapper(async (req, res) => {
  const book = await bookModel.findByIdAndDelete(req.params.id);

  if (!book) {
    return res.status(404).json({status: httpStatusText.FAIL, message: 'Book not found'});
  }

  res.status(200).json({status: httpStatusText.SUCCESS, message: 'Book deleted successfully'});
});
