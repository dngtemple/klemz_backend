const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_secret_key';
require('dotenv').config();
const appPassword = process.env.NODEMAILER
const nodemailer = require('nodemailer');


const UserSchema = require('../model/usermodel'); 
const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  
  if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
      const verified = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
      req.user = verified;
      next();
  } catch (error) {
      res.status(400).json({ message: 'Invalid token.' });
  }
};


router.get('/users', async (req, res) => {
  try {
    const users = await UserSchema.find(); 
    res.status(200).json(users); 
  } catch (error) {
    res.status(500).json({ message: 'Server error, unable to fetch users' });
  }
});



router.get('/users/:id', verifyToken, async (req, res) => {
  try {
      const user = await UserSchema.findById(req.params.id); // Find user by ID

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user); // Sends the user as a JSON response
  } catch (error) {
      res.status(500).json({ message: 'Server error, unable to fetch user' });
  }
});






  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      const user = await UserSchema.findOne({ email });
   
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '10mins' });
  
      res.status(200).json({ message: 'Login successful', token ,user});
    } catch (error) {
      res.status(500).json({ message: 'Server error during login' });
    }
  });



router.post("/register", function(req, res) {
  let data = req.body;

  bcrypt.genSalt(10, function(err, Salt) {
    if (err) {
      console.log(err);
      return res.send({ success: false, message: "Registration problems" });
    }

    bcrypt.hash(data.password, Salt, function(err, newpassword) {
      if (err) {
        console.log(err);
        return res.send({ success: false, message: "Registration problems" });
      }

      data.password = newpassword;

      UserSchema.create(data)
        .then(function(user) {
          // ✅ Email sending logic after successful registration

          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: "maryturneru42@gmail.com",
              pass: appPassword
            },
          });

          const mailOptions = {
            from: "maryturneru42@gmail.com",
            to: user.email,
            subject: 'Welcome to Our Platform!',
            text: `Hi ${user.name || 'there'},\n\nYour registration was successful. Welcome aboard!`,
          };

          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.log('Email error:', error);
              // Still send success since registration worked
              return res.send({ success: true, message: "Registered, but email failed to send" });
            } else {
              console.log('Email sent: ' + info.response);
              return res.send({ success: true, message: "Registration Successful. Email sent." });
            }
          });
        })
        .catch(function(err) {
          console.log(err);
          res.send({ success: false, message: "Registration problems" });
        });
    });
  });
});



router.put('/users/:id', async (req, res) => {
  const { id } = req.params; // Get user ID from request params
  const updateData = req.body; // Get the update data from the request body

  try {
    const updatedUser = await UserSchema.findByIdAndUpdate(
      id,
      { $set: updateData }, // Update only the provided fields
      { new: true, runValidators: true } // Return updated user and run validators
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error, unable to update user', error: error.message });
  }
});


router.post('/forgot-password', async (req, res) => {
  try {
      const { email, newPassword } = req.body;
      
      if (!email || !newPassword) {
          return res.status(400).json({ message: 'Email and new password are required' });
      }

      const user = await UserSchema.findOne({ email });
      
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Password has been updated successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error during password reset' });
  }
});




  

module.exports = router;
module.exports.verifyToken = verifyToken;
