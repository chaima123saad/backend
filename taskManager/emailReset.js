const nodemailer = require("nodemailer");
require('dotenv').config();

const sendPasswordResetEmail = (email, resetUrl) =>{
    
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  
   transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password reset request',
      text: `
        Hello,You recently requested a password reset for your account. Please click the link below to reset your password:\n
        ${resetUrl}\n
        If you did not make this request, you can ignore this email.
      `
    });
  }

  module.exports = sendPasswordResetEmail;
  
  
  