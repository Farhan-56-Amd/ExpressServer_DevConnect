const express = require('express')
const connectDB = require('./config/database')
const User = require('./models/user')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')


app.use(express.json())
app.use(cookieParser())


// Sign Up API
app.post('/signup',async (req,res) => {
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

app.post('/login',async (req,res) => {
  try{
    const {email , password} = req.body

    const user = await User.findOne({email})
    if(!user) {
      throw new Error('Invalid Credentials')
    }
    console.log(password,user.password)
    const isPasswordValid = await bcrypt.compare(password,user.password)

    if(!isPasswordValid) {
      throw new Error('Invaild Credentials')
    }
    
    // after successful login token creation 
    const token = await jwt.sign({_id:user._id},'DevtinderSecretdata')
    res.cookie('token',token)
    res.send('Login Successfull')

  } catch (err) {
    res.status(500).send('Something went wrong: ' + err.message)
  }
})

// get loggedIn user data

app.get('/profile', async (req,res) => {
  try {
    const {token} = req.cookies;

    if(!token){
      throw new Error('Unauthorized Access')
    }
    
    // verify that token
    const validatedToken = await jwt.verify(token,'DevtinderSecretdata')
    const user = await User.findOne({ _id : validatedToken._id })

    if(!user){
      throw new Error('No user found')
    }

    res.send(user)
  } catch (err) {
    res.status(500).send('Something went wrong: ' + err.message)
  }
})

// get user using emailId
app.get('/user',async (req,res) => {
   try {
     const email = req.body.email
     console.log(email)
     const user = await User.findOne({email : email})
  
     if(!user) {
        return res.status(500).send('User not found')
     } 
       res.send(user)
     

   }catch (err) {
     res.status(500).send('Something went wrong: ' + err.message)
   }
})

// get feed API 
app.get('/feed',async (req,res) => {
  try {
     const users = await User.find({})

     if(!users.length) {
      return res.status(500).send('No user found')
     }

     res.send(users)
  } catch (err) {
     res.status(500).send('Something went wrong: ' + err.message)
  }
})

// delete User

app.delete('/user',async (req,res) => {
  try {
    const userId = req.body.userId

    await User.findByIdAndDelete({_id : userId})

    res.send('User deleted successdfully')
  }catch (err) {
   res.status(500).send('Something went wrong: ' + err.message)
  }
})

//Update User details 

app.patch('/user/:userId', async (req,res) => {
  try {
    const userId = req.params.userId
    const data = req.body
    const allowedUpdates = ['firstName','lastName','password','photoUrl','about','skills']

    const isValidRequest = Object.keys(data).every(field => {
      return allowedUpdates.includes(field)
    })

    if(!isValidRequest){
      throw new Error('Modification failed , tried modifying something non allowed')
    }

    const user = await User.findByIdAndUpdate({_id : userId},data,{runValidators:true})

    res.send('User data updated successfully')
  }catch (err) {
    res.status(500).send('Something went wrong: ' + err.message)
  }
})

connectDB()
  .then(() => {
    console.log('DB Connection success')
    app.listen(7777, () => {
      console.log("server is listening at port 7777");
    });
  })
  .catch((err) => {
    console.log('DB is not connected')
  });


