const express = require('express');
const router = express.Router();
const appointmentSchema=require("../model/appointmentmodel")

router.get('/appointments/:userId', async (req, res) => {
  try {
    const { userId } = req.params; 
    const appointments = await appointmentSchema.find({ userID: userId });

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
    const { userID, barberID } = req.body; 

    if (!userID || !barberID ) {
      return res.status(400).json({ message: 'userID, barberID, and datetime are required' });
    }

    // Create a new appointment
    const newAppointment = new appointmentSchema({
      userID,
      barberID,
      status: false, 
    });

    await newAppointment.save();

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error, unable to create appointment' });
  }
});


router.get('/appointments/all', async (req, res) => {
  try {
    const appointments = await appointmentSchema.find().populate();

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found' });
    }

    res.status(200).json(appointments); 
  } catch (error) {
    res.status(500).json({ message: 'Server error, unable to fetch appointments' });
  }
});


module.exports = router;
