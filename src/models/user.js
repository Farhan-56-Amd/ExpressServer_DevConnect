const mongoose = require('mongoose')
const validator = require("validator");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 25,
    },
    lastName: {
      type: String,
      minLength: 4,
      maxLength: 25,
    },
    password: {
      type: String,
      required: true,
      validate : {
        validator : (value) => {
            return (
              value.length >= 8 && 
              /[A-Z]/.test(value) && 
              /[0-9]/.test(value)
            );
        },
        message : "Password must be at least 8 characters and contain an uppercase letter and a number."
      }
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => { return validator.isEmail(value) },
        message: "Please enter a valid email address.",
      },
    },
    age: {
      type: Number,
      required: true,
      min: 15,
    },
    gender: {
      type: String,
      validate: {
        validator : (value) => {return ["Male", "Female", "Others"].includes(value) },
        message : "Gender is not valid , pls check."
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.google.com/imgres?q=avatar%20profile&imgurl=https%3A%2F%2Fuxwing.com%2Fwp-content%2Fthemes%2Fuxwing%2Fdownload%2Fpeoples-avatars%2Fdefault-avatar-profile-picture-male-icon.svg&imgrefurl=https%3A%2F%2Fuxwing.com%2Fdefault-avatar-profile-picture-male-icon%2F&docid=jibFVCPRb18G_M&tbnid=9mBnx_NddZsWYM&vet=12ahUKEwii7IGZxtKVAxWkwjgGHSo-EKsQnPAOegUI1gUQAA..i&w=800&h=800&hcb=2&ved=2ahUKEwii7IGZxtKVAxWkwjgGHSo-EKsQnPAOegUI1gUQAA",
     validate : {
        validator : (value) => {
            return validator.isURL(value)
        },
        message : 'Please upload valid pic.'
     }   
    },
    about: {
      type: String,
      default: "Hey there I am using this",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.comparePassword = async function(enteredPassword) {
  const user =this;
  const flag = await bcrypt.compare(enteredPassword,this.password);
  return flag;
}

userSchema.methods.generateToken = async function() {
  const user = this;
  const token = jwt.sign({_id:user._id},'DevtinderSecretdata')
  return token;
}


module.exports = mongoose.model('User',userSchema)