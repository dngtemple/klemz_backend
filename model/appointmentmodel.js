const mongoose = require('mongoose');


const appointmentSchema = new mongoose.Schema({
  barberID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barber', // References the Barber model
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User model
    required: true,
  },
  haircutID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Haircut', // References the Haircut model
    required: true,
  },
  status: {
    type: Boolean,
    default: false, 
  },
  time:{
    type : String,
    required:true
  }
}, {
  timestamps: true, 
});

// Export the model
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
