import mongoose from 'node:mongoose';

const reviewSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  book: {type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true},
  rating: {type: Number, min: 1, max: 5, required: true},
  review: {type: String, required: true},
  createdAt: {type: Date, default: Date.now}
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
