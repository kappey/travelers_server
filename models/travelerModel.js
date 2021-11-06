const mongoose = require('mongoose');
const Joi = require('joi');


const travelerSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    address:String,
    city:String,
    country:String,
    state:String,
    
    latitude: Number, 
    longitude:Number,
  
    phoneNumber:String,
    language:String,
    dob:Date,
    interests:{
        type:Array, default:[]
    },
    followers:{
        type:Array, default:[]
    },
    followins:{
        type:Array, default:[]
    },
    isAdmin:{
        type:Boolean, default:false
    },
    date_created:{
        type:Date, default:Date.now()
    },
    isActive:{
        type:Boolean, default:true
    }
});

exports.TravelerModel =  mongoose.model("travelers" , travelerSchema);


exports.validPost= (_postBody) => {
    let JoiSchema = Joi.object({
        firstName:Joi.string().min(1).required(),
        lastName:Joi.string().min(1).required(),
        email:Joi.string().min(3).max(200).email().required(),
        address:Joi.string().min(3).max(200),
        city:Joi.string().min(3).max(200),
        state:Joi.string().min(3).max(200),
        language:Joi.string().min(3).max(200),
        phoneNumber:Joi.string().min(3).max(10),
        interests:Joi.array(),
        longitude:Joi.number().required(),
        latitude:Joi.number().required(),
        dob:Joi.date().required()
    })

    return JoiSchema.validate(_postBody);
};