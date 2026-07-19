const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authUser = async (req,res,next) => {
   try {
       const { token } = req.cookies
       
       if(!token) {
         throw new Error('Unauthorized Acces')
       }

       const validatedToken = await jwt.verify(token,'DevtinderSecretdata')
       const { _id } = validatedToken

       const user = await User.findById(_id) 
       
       if(!user) {
        throw new Error('No user found')
       }

       req.user = user

       next()

   } catch(err) {
     res.status(500).send('Something went wrong ' + err.message)
   }
}

module.exports = {authUser}