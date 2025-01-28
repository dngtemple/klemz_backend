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
  price: {
    type: Number,
    default:100,
  },
  seat:{
    type:String,
  },
  availableTimes: {
    type: [String],
    required: true,
    enum: [
      "9:00am", "9:30am", "10:00am", "10:30am", 
      "11:00am", "11:30am", "12:00pm", "12:30pm",
      "1:00pm", "1:30pm", "2:00pm", "2:30pm", 
      "3:00pm", "3:30pm", "4:00pm", "4:30pm", 
      "5:00pm"
    ],
  },
}, {
  timestamps: true, 
});

const Barber = mongoose.model('Barber', barberSchema);

module.exports = Barber;
