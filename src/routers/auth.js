const express = require('express')
const authRouter = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

// Sign Up API
authRouter.post('/signup',async (req,res) => {
  try {
      const userData = req.body
      const allowedUserData = ['firstName','lastName','password','age','email','gender','photoUrl','about','skills']

      const isValidRequest = Object.keys(userData).every(res => {
           return allowedUserData.includes(res)
      })

      if(!isValidRequest){
         throw new Error('payload is not correct')
      }

      const {firstName,lastName,password,age,email,gender,photoUrl,about,skills} = userData;
      const hashPassword = await bcrypt.hash(password,10)

      const user = new User({
        firstName,
        lastName,
        age,
        email,
        gender,
        photoUrl,
        about,
        skills,
        password : hashPassword
      })
      await user.save()
  
      res.send('User is Registered successfully')
    } catch(err) {
      res.status(500).send('Something went wrong: ' + err.message)
    }

})

//Login API

authRouter.post('/login',async (req,res) => {
  try{
    const {email , password} = req.body

    const user = await User.findOne({email})
    if(!user) {
      throw new Error('Invalid Credentials')
    }
    console.log(password,user.password)
    const isPasswordValid = await user.comparePassword(password)

    if(!isPasswordValid) {
      throw new Error('Invaild Credentials')
    }
    
    // after successful login token creation 
    const token = await user.generateToken()
    res.cookie('token',token)
    res.send('Login Successfull')

  } catch (err) {
    res.status(500).send('Something went wrong: ' + err.message)
  }
})

authRouter.get('/logout' , (req,res) => {
  res.cookie('token',null,{expires : new Date(0)})
  // res.clearCookie("token");
  res.send('You have been logout')
})

module.exports = authRouter