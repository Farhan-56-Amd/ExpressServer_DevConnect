const mongoose = require('mongoose')

const connectDB = async () => {
   await mongoose.connect("mongodb+srv://farhan_tcs:Coursera1999@nodeexpresstutorials.exbcxlh.mongodb.net/developerConnect")
}

module.exports = connectDB