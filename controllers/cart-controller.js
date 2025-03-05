import mongoose from 'mongoose';
import {bookModel} from '../models/book-model.js';
import {asyncWrapper} from '../utils/async-wrapper.js';
import httpStatusText from '../utils/http-status-text.js';
import createLogger from '../utils/logger.js';

const cartLogger = createLogger('cart-service');

// ========================================================================================
//                          helper Function (generate new session)
// ===========================================================================================
const fetchRequiredBook = async (req, res, next) => {
  const id = req.params.id;
  const requiredBook = await bookModel.findOne({_id: id}, {title: 1, _id: 1, price: 1, stock: 1});
  if (!requiredBook) {
    cartLogger.error('❌ Book not found');
    const error = new Error('❌ Book not found');
    error.status = 400;
    error.httpStatusText = httpStatusText.FAIL;
    return next(error);
  }
  cartLogger.info(`📚 Book found in the database: ${requiredBook.title}`);

  return requiredBook;
};

const addToCartSession = asyncWrapper(async (req, res, next) => {
  const requiredBook = await fetchRequiredBook(req, res, next);
  const sessionCollection = mongoose.connection.collection('sessions');

  // This searches for a session where the "userID" field matches the logged-in user's ID using a regex pattern.
  // i used regex pattern becouse connect-mongo  stores sessions as strings in MongoDB
  const sessionDoc = await sessionCollection.findOne({session: {$regex: `"userID":"${req.user.id}"`}});
  if (sessionDoc) {
    try {
      // Parse the stored session data (JSON string) into a JavaScript object
      const sessionData = JSON.parse(sessionDoc.session);

      sessionData.cart = sessionData.cart || [];
      sessionData.cart.push(requiredBook);

      const result = await sessionCollection.updateOne({_id: sessionDoc._id}, {$set: {session: JSON.stringify(sessionData)}});

      if (result.modifiedCount === 0) {
        cartLogger.error('❌ Session found, but nothing was modified.');
        return next(new Error('❌ Session found, but nothing was modified.'));
      }

      cartLogger.info('🎉 Item successfully added to the existing cart!');
      return res.status(200).json({status: httpStatusText.SUCCESS, data: sessionData.cart});
    } catch (error) {
      cartLogger.error('❌ Error parsing session data:', error);
      return next(new Error('❌ Failed to parse session data'));
    }
  }

  cartLogger.info('⚠️ No session found for this user. Creating a new session...');

  req.session.regenerate(async (err) => {
    if (err) {
      cartLogger.error('🚨 Session regeneration failed', {error: err});
      return next(new Error('🚨 Session regeneration failed'));
    }

    req.session.userID = req.user.id;
    req.session.cart = [requiredBook];

    await sessionCollection.insertOne({session: JSON.stringify({userID: req.user.id, cart: [requiredBook]})});

    cartLogger.info('🎉 New session created and book added to cart!');
    return res.status(200).json({status: httpStatusText.SUCCESS, sessionID: req.sessionID, data: req.session.cart});
  });
});

// ========================================================================================
//                          Add book to cart
// ===========================================================================================

// - When a logged-in user places an order, a session is created (if not already active),
//   and their cart data is stored in the session. This session is then persisted in MongoDB
//   until it expires.
//
// - If a different user logs in and the current session does not belong to them,
//   they are redirected to the `addToCart` function. This function checks whether
//   the user has an existing session in the database:
//   - If a session exists, it is restored, and items are added to their cart.
//   - If no session is found, a new session is generated, stored in the database,
//     and linked to the user’s ID.

export const addBookToCart = asyncWrapper(async (req, res, next) => {
  if (req.session.userID !== req.user.id) {
    return addToCartSession(req, res, next);
  }

  // sessionMiddleware should not generate a new cookie on every request unless: Session is not being reused
  // so i set here req.session.userID for req.user.id

  req.session.userID = req.user.id;
  if (!req.session.cart) {
    req.session.cart = [];
  }

  const requiredBook = await fetchRequiredBook(req, res, next);
  req.session.cart.push(requiredBook);
  return res.status(200).json({status: httpStatusText.SUCCESS, sessionID: req.sessionID, data: req.session.cart});
});

// ========================================================================================
//                         remove book from cart
// ===========================================================================================

export const removeBookFromCart = asyncWrapper(async (req, res, next) => {
  if (req.user.id !== req.session.userID) {
    const sessionCollection = mongoose.connection.collection('sessions');
    const sessionDoc = await sessionCollection.findOne({session: {$regex: `"userID":"${req.user.id}"`}});
    if (!sessionDoc) {
      cartLogger.error('❌ logged-in user doesnt have data');
      const error = new Error('❌ logged-in user doesnt have data');
      error.status = 400;
      error.httpStatusText = httpStatusText.FAIL;
      return next(error);
    }
    const userData = JSON.parse(sessionDoc.session);

    const updatedBooks = userData.cart.filter((book, index) => index !== userData.cart.findIndex((b) => b._id === req.params.id));
    userData.cart = updatedBooks;
    const result = await sessionCollection.updateOne({_id: sessionDoc._id}, {$set: {session: JSON.stringify(userData)}});

    if (result.modifiedCount === 0) {
      cartLogger.error('❌ ❌ Session found, but there is no data to remove.');
      return next(new Error('❌ Session found, but there is no data to remove.'));
    }

    cartLogger.info('🎉 Removed this book  from database successfully');
    return res.status(200).json({status: httpStatusText.SUCCESS, data: userData.cart});
  }
  req.session.userID = req.user.id;

  req.session.cart = req.session.cart.filter((book, index) => index !== req.session.cart.findIndex((b) => b._id === req.params.id));
  cartLogger.info('🎉 Removed this book  from session successfully');
  return res.status(200).json({status: httpStatusText.SUCCESS, data: req.session.cart});
});

// ========================================================================================
//                          view user cart
// ===========================================================================================

export const viewUserCart = asyncWrapper(async (req, res, next) => {
  if (req.user.id !== req.session.userID) {
    const sessionCollection = mongoose.connection.collection('sessions');
    const sessionDoc = await sessionCollection.findOne({session: {$regex: `"userID":"${req.user.id}"`}});
    if (!sessionDoc) {
      cartLogger.error('❌ logged-in user doesnt have data');
      const error = new Error('❌ logged-in user doesnt have data');
      error.status = 400;
      error.httpStatusText = httpStatusText.FAIL;
      return next(error);
    }
    cartLogger.info('🎉 Retrived data from database successfully');
    const sessionData = JSON.parse(sessionDoc.session);
    return res.status(200).json({status: httpStatusText.SUCCESS, data: sessionData.cart});
  }
  req.session.userID = req.user.id;

  cartLogger.info('🎉 Retrived data successfully');
  return res.status(200).json({status: httpStatusText.SUCCESS, data: req.session.cart});
});
