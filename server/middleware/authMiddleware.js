const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.role === 'admin') {
        const mongoose = require('mongoose');
        const adminCollection = mongoose.connection.collection('admin');
        const adminDoc = await adminCollection.findOne({ _id: new mongoose.Types.ObjectId(decoded.userId) });
        if (adminDoc) {
          req.user = { _id: adminDoc._id, role: 'admin', email: adminDoc.email };
        }
      } else {
        req.user = await User.findById(decoded.userId).select('-password');
      }
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
