const express = require('express')
const profileRouter = express.Router()
const {authUser} = require('../middleware/auth')

// get loggedIn user data

profileRouter.get('/profile',authUser, async (req,res) => {
  try {
    const user = req.user
    res.send(user)
  } catch (err) {
    res.status(500).send('Something went wrong: ' + err.message)
  }
})

module.exports = profileRouter