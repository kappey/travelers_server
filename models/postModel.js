const mongoose = require('mongoose');
const Joi = require('joi');
const geocoder = require ('../utils/geocoder');
const lookup = require('country-code-lookup');

const postSchema = new mongoose.Schema({
    postContent:String,
    traveler_id:String,
    images:{
        type: Array, default:[]
    },
    longitude:Number,
    latitude:Number,
    location: {
        city:{},
        state:{}
    },
    filePath:String,
    likes: {
        type: Array, default:[]
    },
    date_created:{
        type:Date, default:Date.now()
    }
});

postSchema.pre('save', async function (next) {
res = await geocoder.reverse({lat:this.latitude, lon:this.longitude});
this.location.city = res[0].city;
this.location.state = await(lookup.byInternet(res[0].countryCode).country);
});


exports.PostModel = mongoose.model("posts" , postSchema);

exports.validPost= (_postBody) => {
    let JoiSchema = Joi.object({
        postContent:Joi.string().min(1),
        images:Joi.string(),
        longitude:Joi.number().required(),
        latitude:Joi.number().required(),
        lokes:Joi.array()
    })

    return JoiSchema.validate(_postBody);
};