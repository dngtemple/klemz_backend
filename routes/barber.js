const express = require('express');
const barberSchema = require('../model/barbermodel');
const router = express.Router();
const verifyToken = require("./user")

// Route to get all barbers

router.get('/barbers',verifyToken, async (req, res) => {
  try {
    const barbers = await barberSchema.find(); 
    res.status(200).json(barbers); 
  } catch (error) {
    res.status(500).json({ message: 'Server error, unable to fetch barbers' });
  }
});


module.exports = router;
