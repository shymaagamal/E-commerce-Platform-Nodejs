import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import validator from 'validator';
const userSchema = new mongoose.Schema(
  {
    name: {type: String, required: [true, 'Username is required'], trim: true},
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: 'Invalid email address'
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters']
    },
    role: {type: String, enum: ['user', 'admin'], default: 'user'},
    token: {type: String}
  },
  {timestamps: true}
);
userSchema.methods.comparePasswords = function (password) {
  return bcrypt.compareSync(password, this.password);
};
userSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});
userSchema.pre('findOneAndUpdate', function (next) {
  const updatedData = this.getUpdate();
  if (updatedData.$set.password) {
    try {
      const hashedPassword = bcrypt.hashSync(updatedData.$set.password, 10);
      updatedData.password = hashedPassword;
      this.setUpdate(updatedData);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

export const UserModel = mongoose.model('User', userSchema);

