const mongoose = require('mongoose');

// Define the barber schema
const barberSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  price:{
    type:Number,
    required:true
  }
}, {
  timestamps: true, 
});

const Barber = mongoose.model('Barber', barberSchema);

module.exports = Barber;
