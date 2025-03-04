import {bookModel} from '../models/book-model.js';
import {asyncWrapper} from '../utils/async-wrapper.js';
import httpStatusText from '../utils/http-status-text.js';
import createLogger from '../utils/logger.js';
import mongoose from 'mongoose';

const cartLogger = createLogger('cart-service');


// ========================================================================================
//                          helper Function (generate new session)
// ===========================================================================================
const fetchRequiredBook=async (req,res,next)=>{
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
    const userIdString = req.user?.id?.toString();

    let sessionDoc = await sessionCollection.findOne({ "session": { $regex: `"userID":"${userIdString}"` } });

    if (sessionDoc) {
        try {
            const sessionData = JSON.parse(sessionDoc.session);

            sessionData.cart = sessionData.cart || [];
            sessionData.cart.push(requiredBook);

            const result = await sessionCollection.updateOne(
                { _id: sessionDoc._id }, 
                { $set: { session: JSON.stringify(sessionData) } }
            );

            if (result.modifiedCount === 0) {
                cartLogger.error("❌ Session found, but nothing was modified.");
                return next(new Error("❌ Session found, but nothing was modified."));
            }

            cartLogger.info("🎉 Item successfully added to the existing cart!");
            return res.status(200).json({ status: httpStatusText.SUCCESS, data: sessionData.cart });

        } catch (error) {
            cartLogger.error("❌ Error parsing session data:", error);
            return next(new Error("❌ Failed to parse session data"));
        }
    }

    cartLogger.info("⚠️ No session found for this user. Creating a new session...");

    req.session.regenerate(async (err) => {
        if (err) {
            cartLogger.error("🚨 Session regeneration failed", { error: err });
            return next(new Error("🚨 Session regeneration failed"));
        }

        req.session.userID = userIdString;
        req.session.cart = [requiredBook];

        await sessionCollection.insertOne({
            session: JSON.stringify({
                userID: userIdString,
                cart: [requiredBook],
            }),
        });

        cartLogger.info("🎉 New session created and book added to cart!");
        return res.status(200).json({ status: httpStatusText.SUCCESS, sessionID: req.sessionID, data: req.session.cart });
    });
});


export const addBookToCart = asyncWrapper(async (req, res, next) => {

    if (req.session.userID !== req.user.id) {
         return addToCartSession(req, res, next);
    }
    if (!req.session.cart) {
        req.session.userID = req.user.id;
        req.session.cart = [];
    }
 
    const requiredBook= await fetchRequiredBook(req, res, next);
    req.session.cart.push(requiredBook);
    req.session.save((err) => {
        if (err) {
            cartLogger.error("❌ Failed to save session:", err);
            return next(new Error("❌ Failed to save session"));
        }

        cartLogger.info('🎉 Book added to cart successfully!');
        return res.status(200).json({ status: httpStatusText.SUCCESS, sessionID: req.sessionID, data: req.session.cart });
    });
});





export const removeBookFromCart = asyncWrapper((req, res, next) => {

});

export const viewUserCart = asyncWrapper((req, res, next) => {

});
