const mongoose = require('mongoose');
const Joi = require('joi');
const { sortedIndexOf } = require('lodash');

const messageSchema = new mongoose.Schema({
    message:String,
    sender_id: String,
    image_id:{
        type: Array, default:[]
    },
    date_created:{
        type:Date, default:Date.now()
    }
});

exports.MessageModel = mongoose.model("messages" , messageSchema);

exports.validMessage= (_messageBody) => {
    let JoiSchema = Joi.object({
        message:Joi.string().min(1),
        sender_id:Joi.string().min(3).max(200).required(),
        image_id:Joi.string().min(3).max(200)
    }).or('message','image_id').required() // at least one required

    return JoiSchema.validate(_messageBody);
};