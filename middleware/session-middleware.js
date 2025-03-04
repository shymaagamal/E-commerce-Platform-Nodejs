import process from 'node:process';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import 'dotenv/config';

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: 'sessions',
    ttl: 60
  }),
  cookie: {
    secure: false, 
    httpOnly: true, 
    maxAge: 1000 * 60 * 60 // 1h
  }
});

export default sessionMiddleware;
