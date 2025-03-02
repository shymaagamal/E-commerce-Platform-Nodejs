import mongoose from 'node:mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {type: String, required: [true, 'Username is required'], trim: true},
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
      lowercase: true,
      match: [
        /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
        'Invalid email format'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters']
    },
    role: {type: String, enum: ['user', 'admin'], default: 'user'},
    isVerified: {type: Boolean, default: false}
  },
  {timestamps: true}
);

export const UserModel = mongoose.model('User', userSchema);


