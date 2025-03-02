import mongoose from 'node:mongoose';

const orderSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  books: [{type: mongoose.Schema.Types.ObjectId, ref: 'Book'}],
  totalPrice: {type: Number, required: true},
  status: {type: String, enum: ['pending', 'completed', 'canceled'], default: 'pending'}
}, {timestamps: true});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
