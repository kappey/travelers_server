const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const {config} = require('../config/sd');

const minDOB = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18);

exports.genSignInToken = (_id) => {
  let token = jwt.sign({_id},config.jwtSecret);
  return token;
}

exports.genForgotPasswordToken = (_id) => {
  let token = jwt.sign({_id},config.jwtSecret,{expiresIn:"60mins"});
  return token;
}

const userSchema = new mongoose.Schema({
    traveler_id:String,
    password:String,
    changePasswordToken:String,
    forgotPasswordDate:Date,
    date_created:{
      type:Date, default:Date.now
  }
});

exports.UserModel =  mongoose.model("users" , userSchema);

exports.validSignUp = (_userBody) => {
    let joiSchema = Joi.object({
        firstName:Joi.string().min(3).max(200).required(),
        lastName:Joi.string().min(3).max(200).required(),
        email:Joi.string().min(10).max(100).email().required(),
        address:Joi.string().min(3).max(200).required(),
        city:Joi.string().min(3).max(30).required(),
        country:Joi.string().min(3).max(30).required(),
        state:Joi.string().min(3).max(30),
        language:Joi.string().min(3).max(10),
        phoneNumber:Joi.string().min(3).max(15).required(),
        dob:Joi.date().max(minDOB).required(),
        password:Joi.string().min(3).max(200).required(),
        latitude:Joi.number(),
        longitude:Joi.number(),
    })

    return joiSchema.validate(_userBody);
  }

  exports.validSignIn = (_userBody) => {
    let joiSchema = Joi.object({
      email:Joi.string().min(10).max(100).email().required(),
      password:Joi.string().min(3).max(200).required(),
    })

    return joiSchema.validate(_userBody);
  }

  exports.validForgotPassword = (_userBody) => {
    let joiSchema = Joi.object({
      email:Joi.string().min(10).max(100).email().required()
    })

    return joiSchema.validate(_userBody);
  }

  exports.validResetPasswords = (_userBody) => {
    let joiSchema = Joi.object({
      password:Joi.string().min(3).max(200).required()
    })

    return joiSchema.validate(_userBody);
  }