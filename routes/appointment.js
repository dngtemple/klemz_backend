const express = require('express');
const router = express.Router();
const appointmentSchema=require("../model/appointmentmodel")
const verifyToken = require("./user")




router.get('/appointments/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params; 
    const appointments = await appointmentSchema
      .find({ userID: userId })
      .populate('haircutID')
      .populate('barberID') // Populating haircut details

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for this user' });
    }

    res.status(200).json(appointments); 
  } catch (error) {
    res.status(500).json({ message: 'Server error, unable to fetch appointments' });
  }
});



router.post('/appointments/create', async (req, res) => {
  try {
    const { userID, barberID , haircutID ,time } = req.body; 

    if (!userID || !barberID || !haircutID || !time) {
      return res.status(400).json({ message: 'userID, barberID, and datetime are required' });
    }

    // Create a new appointment
    const newAppointment = new appointmentSchema({
      userID,
      barberID,
      haircutID,
      time,
      status: false, 
    });

    await newAppointment.save();

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error, unable to create appointment' });
  }
});


router.get('/appointments/all' ,async (req, res) => {
  try {
    const appointments = await appointmentSchema.find()
    .populate('haircutID')
    .populate('userID')
    .populate('barberID')

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found' });
    }

    res.status(200).json(appointments); 
  } catch (error) {
    res.status(500).json({ message: 'Server error, unable to fetch appointments' });
  }
});


router.delete('/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAppointment = await appointmentSchema.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment deleted successfully', deletedAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error, unable to delete appointment' });
  }
});



module.exports = router;
