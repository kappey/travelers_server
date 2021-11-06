const mongoose = require('mongoose');
const Joi = require('joi');
const geocoder = require ('../utils/geocoder');

const statusSchema = new mongoose.Schema({
    status:String,
    traveler_id:String,
    longitude:Number,
    latitude:Number,
    address: String,
    date_created:{
        type:Date, default:Date.now()
    }
});

statusSchema.pre('save', async function (next) {
const location = await geocoder.reverse({lat:this.latitude, lon:this.longitude});
// const location = await geocoder.geocode(this.address);
console.log(location);
});

exports.StatusModel = mongoose.model("statuses" , statusSchema);

exports.validStatus= (_statusBody) => {
    let JoiSchema = Joi.object({
        status:Joi.string().min(1).max(200),
        traveler_id:Joi.string().min(3).max(200).required(),
        longitude:Joi.number().required(),
        latitude:Joi.number().required()
    })

    return JoiSchema.validate(_statusBody);
};