const express = require('express');
const router = express.Router();
const User = require('../models/user');
const sendPasswordResetEmail = require('../emailReset');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  try {
    console.log(req.body.email);
    console.log(req.body.password);
    const user = await User.findByCredentials(req.body.email ,req.body.password);
    
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email' });
    }
    
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid password' });
    }
    
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    const { _id, email, role } = user;
    res.json({ token, user: { _id, email, role } });
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error in the back' });
  }
});

  module.exports = router;