const express = require('express')
const profileRouter = express.Router()
const {authUser} = require('../middleware/auth')
const {validateUserData} = require('../utils/dataSanitize')

// get loggedIn user data

profileRouter.get('/profile',authUser, async (req,res) => {
  try {
    const user = req.user
    res.send(user)
  } catch (err) {
    res.status(500).send('Something went wrong: ' + err.message)
  }
})

profileRouter.patch('/profile',authUser , async (req,res) => {
  try {
    
     const requestValidation = validateUserData(req)

     if(!requestValidation) {
      throw new Error('Invaild Request')
     }

     const dataToUpdate = req.body 
     const loggedInUserData = req.user // user Instance

     Object.keys(dataToUpdate).forEach(field => {
          loggedInUserData[field] = dataToUpdate[field]
     })

     await loggedInUserData.save()
     res.json({
       data : loggedInUserData,
       message : 'Profile updated successfully'
     })

  }catch(err) {
    res.status(500).json({message : 'Something went wrong: ' + err.message})
  }
})

module.exports = profileRouter