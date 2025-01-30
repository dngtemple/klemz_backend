const mongoose = require('mongoose');

const haircutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  }
});

const Haircut = mongoose.model('Haircut', haircutSchema);

module.exports = Haircut;
