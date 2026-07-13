const express = require('express')
const connectDB = require('./config/database')
const User = require('./models/user')
const app = express()

app.use(express.json())

// Sign Up API
app.post('/signup',async (req,res) => {
  try {
      const userData = req.body
      const user = new User(userData)
      await user.save()
  
      res.send('User is Registered successfully')
    } catch(err) {
      res.status(500).send('Something went wrong')
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
     res.status(401).send('Something went wrong!')
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
     res.status(401).send('Something went Wrong!')
  }
})

// delete User

app.delete('/user',async (req,res) => {
  try {
    const userId = req.body.userId

    await User.findByIdAndDelete({_id : userId})

    res.send('User deleted successdfully')
  }catch (err) {
    res.status(500).send(err.message)
  }
})

//Update User details 

app.patch('/user', async (req,res) => {
  try {
    console.log(req.body)
    const userId = req.body.userId
    const data = req.body
    console.log(data)
    const user = await User.findByIdAndUpdate({_id : userId},data)

    res.send('User data updated successfully')
  }catch (err) {
    res.status(401).send(err.message)
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


