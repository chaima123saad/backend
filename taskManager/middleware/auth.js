const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to authenticate the user
exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Please authenticate' });
  }
};

// Middleware to check user permissions
exports.checkPermission = (permission) => {
  return async (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ msg: 'Please authenticate' });
    }

    if (user.role !== 'manager') {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    // Add any additional permission checks here
    if (permission === 'createProject' && user.role === 'manager') {
      return next();
    } else if (permission === 'updateProject' && user.role === 'manager') {
      return next();
    } else if (permission === 'deleteProject' && user.role === 'manager') {
      return next();
    } else if (permission === 'filterProjects' && user.role === 'manager') {
      return next();
    }else if (permission === 'getDashboard' && user.role === 'manager') {
      return next();
    } else if (permission === 'getCompletedProjectsByUsers' && user.role === 'manager') {
      return next();
    } else {
      return res.status(403).json({ msg: 'Forbidden' });
    }
  };
};

