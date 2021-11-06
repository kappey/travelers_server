const mongoose = require('mongoose');
const Joi = require('joi');

const commentSchema = new mongoose.Schema({
    comment:String,
    traveler_id:String,
    image_id:String,
    post_id: String,
    likes: {
        type: Array, default:[]
    },
    date_created:{
        type:Date, default:Date.now()
    }
});

exports.CommentModel = mongoose.model("coments" , commentSchema);

exports.validComment= (_commentBody) => {
    let JoiSchema = Joi.object({
        comment:Joi.string().min(1),
        traveler_id:Joi.string().min(3).max(200).required(),
        image_id:Joi.string().min(3).max(200)
    })

    return JoiSchema.validate(_commentBody);
};