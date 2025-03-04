import process from 'node:process';
import jwt from 'jsonwebtoken';

export const generateJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRETE_KEY, {expiresIn: '1h'});
  return token;
};

export const checkPassword = async (user, password) => {
  return user.comparePasswords(password);
};
