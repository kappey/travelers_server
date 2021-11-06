const express = require('express');

const { authToken } = require("../middleware/auth");
const { UserModel } = require('../models/userModel');
const { PostModel, validPost } = require('../models/postModel');
const { TravelerModel } = require('../models/travelerModel');


const router = express.Router();

/* GET all posts. */
router.get('/', /*authToken,*/ async (req, res) => {
    let qSearch = req.query.s;
    let qRegExp = new RegExp(qSearch, "i");
    let perPage = (req.query.pp) ? Number(req.query.pp) : 50;
    let page = req.query.p;
    let sortQ = (req.query.sort) ? (req.query.sort) : "_id";
    let ifReverse = (req.query.r == "y") ? -1 : 1;
  
    try {
      let data = await PostModel.find()
      .sort({ [sortQ]: ifReverse })
          .limit(perPage)
          .skip(page * perPage-perPage)
      res.json(data);
  }
  catch (err) {
      console.log(err);
      res.status(400).json(err);
  }
  });
  
  /* GET all posts by ID */
  router.get("/:travelerID", authToken, async (req, res) => {
    let traveler_id_post = req.params.travelerID;
    try {
        let data = await PostModel.find({traveler_id:traveler_id_post})
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
  });


    /* GET all posts location based */
    router.get('/location', authToken, async (req, res) => {
        let postArrey = [];
        try {
            let currentTraveler = await TravelerModel.findById(req.body.traveler_id);
            let location = currentTraveler.currentLocation;
            postArrey = await PostModel.find({location : location});
            res.json(postArrey);
      }
      catch (err) {
          console.log(err);
          res.status(400).json(err);
      }
});

 /* Create a new post */
 router.post("/", authToken, async (req, res) => {
    let validBody = validPost(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let post = new PostModel(req.body);
        let user = await UserModel.findById(req.userData._id);
        
        post.traveler_id = user.traveler_id;

        await post.save();
        res.status(201).json(post);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});


/* Like / Unlike post */
router.put("/like/:post_id", authToken,  async (req, res) =>{
   try{ 
        let post = await PostModel.findById(req.params.post_id);
        let user = await UserModel.findById(req.userData._id);

       if(!post.likes.includes(user.traveler_id)){
           await post.updateOne({$push: {likes: user.traveler_id}});
           res.status(200).json("liked");
       }else{
           await post.updateOne({$pull: {likes: user.traveler_id}});
           res.status(200).json("unliked");
       }
    }catch (error){
        res.status(500).json(error);
        
    }
})

 /* Edit post */
router.put("/:postEditID",  authToken, async (req, res) => {
    let id_post_edit = req.params.PostEditID;
    let validBody = validPost(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let itemEdit = await PostModel.updateOne({ _id: id_post_edit, traveler_id: req.userData._id }, req.body);
        res.json(itemEdit);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

/* Delete post */
router.delete("/:postDeleteID", authToken, async (req, res) => {
    let deleteID = req.params.postDeleteID;
    try {
        let itemDelete = await PostModel.deleteOne({ _id: deleteID /*, user_id: req.userData._id */  });
        res.json(itemDelete);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;