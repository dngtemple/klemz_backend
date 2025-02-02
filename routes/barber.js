const express = require('express');
const barberSchema = require('../model/barbermodel');
const router = express.Router();

// Route to get all barbers

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  
  if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
      const verified = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
      req.user = verified;
      next();
  } catch (error) {
      res.status(400).json({ message: 'Invalid token.' });
  }
};

router.get('/barbers',verifyToken, async (req, res) => {
  try {
    const barbers = await barberSchema.find(); 
    res.status(200).json(barbers); 
  } catch (error) {
    res.status(500).json({ message: 'Server error, unable to fetch barbers' });
  }
});


module.exports = router;
