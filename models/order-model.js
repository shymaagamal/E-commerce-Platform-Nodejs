import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: 
  {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', 
    required: true
  },
  books: 
  [
    {
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
        quantity: { type: Number, required: true, min: 1 }
    }
  ],
  totalPrice: 
  {
    type: Number,
    required: true
  },
  status: 
  {
    type: String, 
    enum: ['pending', 'completed', 'canceled'], 
    default: 'pending'
  }
}, {timestamps: true});


export default mongoose.model("Order", orderSchema);