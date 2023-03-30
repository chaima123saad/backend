const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const sendPasswordResetEmail = require('../emailReset');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/', async (req, res) => {
    try {
      const user = await User.findByCredentials(req.body.email ,req.body.password);
  
      if (!user) {
        return res.status(400).json({ msg: 'Invalid email or password' });
      }
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
       res.json({token,user});
    
      } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  });
  
   router.get('/profile', auth, (req, res) => {
     res.json(req.user);
   });


router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user){
      return res.status(404).json({ message: 'User not found' });
    }

      const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let resetToken = '';
      for (let i = 0; i < 20; i++) {
        resetToken += characters.charAt(Math.floor(Math.random() * characters.length));
      }

    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail(email, resetUrl);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/reset-password', async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired token' });
    }

    res.render('reset-password', { token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const user = await User.findOne({ resetToken, resetTokenExpiration: {$gt: Date.now() } });

    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired token' });
    }

    user.password = await bcrypt.hash(newPassword, 8);
    user.resetToken =null;
    user.resetTokenExpiration = null;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


  module.exports = router;