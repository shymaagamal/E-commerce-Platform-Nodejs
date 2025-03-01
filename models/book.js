import mongoose from 'node:mongoose';

const bookSchema = new mongoose.Schema({
  title: {type: String, required: true},
  author: {type: String, required: true},
  price: {type: Number, required: true},
  description: {type: String},
  stock: {type: Number, required: true, min: 0},
  image: {type: String},
  reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
}, {timestamps: true});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
