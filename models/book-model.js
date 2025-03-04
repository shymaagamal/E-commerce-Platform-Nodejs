import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {type: String, required: true, trim: true},
  author: {type: String, required: true, trim: true},
  price: {type: Number, required: true, min: 0},
  description: {type: String, trim: true},
  stock: {type: Number, required: true, min: 0},
  image: {type: String}
}, {timestamps: true});

export const bookModel = mongoose.model('Book', bookSchema);
