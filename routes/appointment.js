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
      date,
      status: false, 
    });

    await newAppointment.save();

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error, unable to create appointment' });
  }
});

router.get('/appointments/get/all', async (req, res) => {
  try {
    console.log("Fetching all appointments...");
    const appointments = await appointmentSchema.find()
      .populate('haircutID')
      .populate('userID')
      .populate('barberID');

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found' });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error); // Log full error
    res.status(500).json({ message: 'Server error, unable to fetch appointments', error: error.message });
  }
});




router.get("/todayonly", async (req, res) => {
  try {
    console.log("Fetching today's appointments...");

    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

    const appointments = await appointmentSchema.find({
      createdAt: {
        $gte: new Date(today), // Start of the day
        $lt: new Date(new Date(today).setDate(new Date(today).getDate() + 1)), // Start of next day
      },
    })
      .populate("haircutID")
      .populate("userID")
      .populate("barberID");

    if (appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found for today" });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      message: "Server error, unable to fetch appointments",
      error: error.message,
    });
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
