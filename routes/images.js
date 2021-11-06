const express = require('express');
const path = require('path');
const { v4 } = require('uuid');
const fs = require('fs');

const { authToken } = require("../middleware/auth");
const { UserModel } = require('../models/userModel');
const { ImageModel, validImage } = require('../models/imageModel');

const router = express.Router();

/* GET images listing. */
router.get('/', async (req, res) => {
    let qSearch = req.query.s;
    let qRegExp = new RegExp(qSearch, "i");
    let perPage = (req.query.pp) ? Number(req.query.pp) : 50;
    let page = req.query.p;
    let sortQ = (req.query.sort) ? (req.query.sort) : "_id";
  
    try {
      let data = await ImageModel.find()
          .limit(perPage)
          .skip(page * perPage-perPage)
      res.json(data);
  }
  catch (err) {
      console.log(err);
      res.status(400).json(err);
  }
  });
  
  /* GET all images by ID */
  router.get("/:travelerID", async (req, res) => {
    let traveler_id_image = req.params.travelerID;
    try {
        let data = await ImageModel.find({traveler_id:traveler_id_image})
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
  });


    /* GET all images location based */
    router.get('/location/:iong/:lat', async (req, res) => {
        try {
          let data = await ImageModel.find()
          res.json(data);
      }
      catch (err) {
          console.log(err);
          res.status(400).json(err);
      }
      });

      /* GET one image */
      router.get("/single/:imageID", async (req, res) => {
        let image_id = req.params.imageID;
        try {
            let data = await ImageModel.findOne({_id:image_id})
            res.json(data);
        }
        catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
      });

   /* Upload new image */
   router.post("/", authToken, async (req, res) => {
   
    if (req.files?.file){
        try{
            let image = new ImageModel();
            let user = await UserModel.findById(req.userData._id);
            let file = req.files.file;
            file.ext = path.extname(file.name);
            let nameOfFile = file.name.substring(0 , file.name.indexOf ('.'));
            let randName = nameOfFile + '-' + v4()+ '-' + user.traveler_id + file.ext;
            let filePath = "/uploads/travelerImages/"+ randName;
            let allowExt_ar = [".jpg", ".png", ".gif", ".svg", ".jpeg"];

            if (file.size >= 50 * 1024 * 1024) { 
                return res.status(400).json({ err: "The file is too large, only files up to 50 MB are allowed." });
              }  
            
            else if (!allowExt_ar.includes(file.ext)) {
                return res.status(400).json({ err: "Error: Please upload file in one of those formats: .jpg /.png /.gif /.jpeg /.svg" });
              }

            file.mv("public"+filePath), err => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
                res.json({ fileName: file.name, filePath})
            }

            image.traveler_id = user.traveler_id;
            image.filePath = filePath;

            await image.save();
            res.status(201).json(image._id);
        }
        catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    }
});

/* Delete image */
router.delete("/:imageDelete", authToken, async (req, res) => {
    let deleteImageID = req.params.imageDelete;
    let path = './public';
    try {
        let data = await ImageModel.findOne({_id:deleteImageID})
        path = path + data.filePath;
    }
    catch (err) {
        console.log(err);
    }
    try {
        fs.unlinkSync(path)

    } catch(err) {
        console.error(err)
   } 
    
    try {
        let itemDelete = await ImageModel.deleteOne({ _id: deleteImageID /*, user_id: req.userData._id */  });
        res.json(itemDelete);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;