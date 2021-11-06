const mongoose = require('mongoose');
const Joi = require('joi');

const messengerSchema = new mongoose.Schema({
    mssngrName: String,
    message_id:{
        type: Array, default:[]
    },
    members:{
        type: Array, default:[]
    },
    receivers:{
        type: Array, default:[]
    },
    date_created:{
        type:Date, default:Date.now()
    }
});

exports.MessengerModel = mongoose.model("messangers" , messengerSchema);

exports.validMessanger= (_messengerBody) => {
    let JoiSchema = Joi.object({
        message_id:Joi.array().min(1).required(),
        mssngrName:Joi.string().min(1).max(12),
        members:Joi.array().required(),
        receivers:Joi.array()
    })

    return JoiSchema.validate(_messengerBody);
};