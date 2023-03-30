const nodemailer = require("nodemailer");
require('dotenv').config();

const sendWelcomeEmail = (email, name, password) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'Welcome to our agency',
    text: `Hello ${name},\n\nWelcome to our agency!  Your account has been created successfully.\n You email is : ${email} \n Your password is: ${password}\n\nThank you,\nAgency Team`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = sendWelcomeEmail;


