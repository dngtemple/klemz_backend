const express=require("express");
const cors=require("cors");
const mongoose =require("mongoose")

const PORT=process.env.PORT || 8000;

const app=(express());
app.use(cors())
app.use(express.json())


require('dotenv').config();
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const db=process.env.DB_NAME

const userRouter=require("./routes/user")
const barberRouter=require("./routes/barber")
const appointmentRouter=require("./routes/appointment")


app.use("/user",userRouter);
app.use("/barber",barberRouter);
app.use("/appointment",appointmentRouter)



mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.s9wjca8.mongodb.net/${db}`,)
.then(function(){
    console.log("database connected successfully");
})


app.listen(PORT,function(){
    console.log(PORT,"Api server working success");
})


