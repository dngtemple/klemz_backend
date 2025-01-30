const express = require('express');
const Haircut = require('../model/haircutmodel'); // import the Haircut model
const router = express.Router();

// Route to get all haircuts
router.get('/haircuts', async (req, res) => {
  try {
    const haircuts = await Haircut.find();
    res.status(200).json(haircuts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
