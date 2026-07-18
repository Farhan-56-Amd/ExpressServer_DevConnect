const express = require('express')
const requestRouter = express.Router()
const {authUser} = require('../middleware/auth')

// send Connecttion Request 
requestRouter.post('/sendConnectionRequest',authUser,(req,res) =>{
  try {
    const user = req.user
    res.send(user.firstName + ' has sent the connection request')

  } catch(err) {
    res.status(500).send('Something went wrong: ' + err.message)
  }
})

module.exports = requestRouter