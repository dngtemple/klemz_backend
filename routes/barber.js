const express = require('express');
const barberSchema = require('../model/barbermodel');
const router = express.Router();

// Route to get all barbers
router.get('/barbers', async (req, res) => {
  try {
    const barbers = await barberSchema.find(); 
    res.status(200).json(barbers); 
  } catch (error) {
    res.status(500).json({ message: 'Server error, unable to fetch barbers' });
  }
});


module.exports = router;
