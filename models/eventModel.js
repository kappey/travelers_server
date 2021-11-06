const mongoose = require('mongoose');
const Joi = require('joi');

const eventSchema = new mongoose.Schema({
    eventName:String,
    eventAddress:String,
    eventDate:Date,
    eventTime:String,
    creator_id:String,
    perticipants_id:{
        type: Array, default:[]
    },
    cover_image_id:String,
    images_id:{
        type: Array, default:[]
    },
    date_created:{
        type:Date, default:Date.now()
    }
});

exports.EventModel = mongoose.model("events" , eventSchema);

exports.validEvent= (_eventBody) => {
    let JoiSchema = Joi.object({
        eventName:Joi.string().min(1).required(),
        sender:Joi.string().min(3).max(200).required(),
        receivers:Joi.array().required(),
        image_id:Joi.string().min(3).max(200)
    })

    return JoiSchema.validate(_eventBody);
};