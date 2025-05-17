const express = require('express');
const router = express.Router();
const appointmentSchema=require("../model/appointmentmodel")
const verifyToken = require("./user")
const nodemailer = require('nodemailer');
const User = require('../model/usermodel'); 
const Barber = require('../model/barbermodel'); 


require('dotenv').config();

const appPassword = process.env.NODEMAILER; 




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
    const { userID, barberID, haircutID, time, date } = req.body;

    if (!userID || !barberID || !haircutID || !time || !date) {
      return res.status(400).json({ message: 'userID, barberID, and datetime are required' });
    }

    // Create the appointment
    const newAppointment = new appointmentSchema({
      userID,
      barberID,
      haircutID,
      time,
      date,
      status: false,
    });

    await newAppointment.save();

    // Fetch the user using userID
    const user = await User.findById(userID);
    if (!user || !user.email) {
      return res.status(404).json({ message: 'User not found or email missing' });
    }

    const barber = await Barber.findById(barberID);
    if (!Barber) {
      return res.status(404).json({ message: 'barber not found or email missing' });
    }

    // Set up nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'maryturneru42@gmail.com',
        pass: appPassword // Use App Password if using Gmail
      },
    });

    // Compose the email
    const mailOptions = {
  from: 'maryturneru42@gmail.com',
  to: user.email,
  subject: 'Appointment Confirmation',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; border: 1px solid #eee; padding: 20px;">
      <div style="text-align: center;">
        <h2 style="color: #333;">Klems Barbershop</h2>
        <p style="color: #666; font-size: 18px;">Your Appointment is Confirmed</p>
      </div>

      <div style="margin-top: 30px;">
        <p style="font-size: 16px; color: #444;">Hello <strong>${user.fullName}</strong>,</p>
        <p style="font-size: 16px; color: #444;">
          Thank you for booking with Klems Barbershop! Your appointment is scheduled for:
        </p>
        <ul style="font-size: 16px; color: #444; list-style: none; padding-left: 0;">
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
          <li><strong>Barber:</strong> ${barber.fullName}</li>
        </ul>
        <p style="font-size: 16px; color: #444;">
          Please arrive a few minutes early to ensure a smooth check-in. If you need to modify or cancel your appointment, you can use the link below.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://yourbarbershop.com/manage" style="background-color: #111; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Manage Appointment</a>
        </div>
      </div>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 40px 0;"/>

      <div style="text-align: center;">
        <p style="font-size: 14px; color: #888;">Stay connected with us</p>
        <a href="https://facebook.com/yourbarbershop" style="margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/24/733/733547.png" alt="Facebook"></a>
        <a href="https://instagram.com/yourbarbershop" style="margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/24/733/733558.png" alt="Instagram"></a>
        <a href="https://twitter.com/yourbarbershop" style="margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/24/733/733579.png" alt="Twitter"></a>

        <p style="margin-top: 20px; font-size: 13px; color: #aaa;">
          © ${new Date().getFullYear()} Klems Barbershop. All rights reserved.
        </p>
        <a href="https://yourbarbershop.com" style="font-size: 14px; color: #007bff; text-decoration: none;">Visit Website</a>
      </div>
    </div>
  `,
};


    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error(error);
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
