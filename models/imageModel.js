const mongoose = require('mongoose');
const Joi = require('joi');
const geocoder = require ('../utils/geocoder');

const imageSchema = new mongoose.Schema({
    traveler_id:String,
    image_name:String,
    isProfile:{
        type:Boolean, default:false
    },
    longitude:Number,
    latitude:Number,
    address: String,
    filePath: String,
    likes: {
        type: Array, default:[]
    },
    date_created:{
        type:Date, default:Date.now()
    }
});

imageSchema.pre('save', async function (next) {
const location = await geocoder.reverse({lat:this.latitude, lon:this.longitude});
// const location = await geocoder.geocode(this.address);
console.log(location);
});

exports.ImageModel = mongoose.model("images" , imageSchema);

exports.validImage= (_imageBody) => {
    let JoiSchema = Joi.object({
        traveler_id:Joi.string().min(3).max(200).required(),
        image_name:Joi.string().min(1).required(),
        isProfile:Joi.boolean(),
        longitude:Joi.number().required(),
        latitude:Joi.number().required()
    })

    return JoiSchema.validate(_imageBody);
};