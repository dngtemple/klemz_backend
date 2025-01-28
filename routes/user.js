const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_secret_key';


const UserSchema = require('../model/usermodel'); 
const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const users = await UserSchema.find(); 
    res.status(200).json(users); 
  } catch (error) {
    res.status(500).json({ message: 'Server error, unable to fetch users' });
  }
});



router.get('/users/:id', async (req, res) => {
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
  
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ message: 'Login successful', token ,user});
    } catch (error) {
      res.status(500).json({ message: 'Server error during login' });
    }
  });


  router.post("/register",function(req,res){
    let data=req.body;
  
    bcrypt.genSalt(10,function(err,Salt){
        if(err===null){
            bcrypt.hash(data.password,Salt,function(err,newpassword){
                if(err===null){
                    data.password=newpassword;
                    UserSchema.create(data)
                    .then(function(){
                        res.send({success:true,message:"Registration Successful"});
                    })
                    .catch(function(err){
                        console.log(err);
                        res.send({success:false,message:"Registration problems"});
                    })
                }
                else{
                    console.log(err);
                    res.send({success:false,message:"Registration problems"});
                }
            })
        }
        else{
            console.log(err);
            res.send({success:false,message:"Registration problems"});
        }
    })

})


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


  

module.exports = router;
