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
  status: {
    type: Boolean,
    default: false, 
  },
}, {
  timestamps: true, 
});

// Export the model
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
