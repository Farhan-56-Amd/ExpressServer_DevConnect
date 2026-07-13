const express = require('express')
const connectDB = require('./config/database')
const User = require('./models/user')
const app = express()

app.use(express.json())

app.post('/signup',async (req,res) => {
  try {
      const userData = req.body
      const user = new User(userData)
      await user.save()
  
      res.send('User is Registered successfully')
    } catch(err) {
      res.statusCode(500).send('Something went wrong')
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


