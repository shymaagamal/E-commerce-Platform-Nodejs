import process from 'node:process';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import {asyncWrapper} from './async-wrapper.js';
import createLogger from './logger.js';

dotenv.config();
const emailLogger = createLogger('email-service');

const sender = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendEmail = asyncWrapper(async (email, subject, text, next) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text
  };

  try {
    const info = await sender.sendMail(mailOptions);
    emailLogger.info(`Email sent successfully to ${email}`, {response: info.response});
    return {status: 'success', message: `Email sent to ${email}`};
  } catch (error) {
    emailLogger.error(`Email sending failed for ${email}`, {error: error.message});

    const err = new Error(`Failed to send email: ${error.message}`);
    err.status = 500;
    err.httpStatusText = 'FAIL';
    return next(err);
  }
});
