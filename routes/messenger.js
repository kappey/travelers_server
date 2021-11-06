const express = require('express');
const { authToken } = require("../middleware/auth");
const { MessengerModel, validMessenger} = require('../models/messengerModel');
const { MessageModel, validMessage } = require('../models/messageModel');

const router = express.Router();

/* GET statuses listing. */
router.get('/', async (req, res) => {
    let qSearch = req.query.s;
    let qRegExp = new RegExp(qSearch, "i");
    let perPage = (req.query.pp) ? Number(req.query.pp) : 50;
    let page = req.query.p;
    let sortQ = (req.query.sort) ? (req.query.sort) : "_id";
  
    try {
      let data = await MessengerModel.find()
          .limit(perPage)
          .skip(page * perPage-perPage)
      res.json(data);
  }
  catch (err) {
      console.log(err);
      res.status(400).json(err);
  }
  });
  
  /* GET all statuses by ID */
  router.get("/:travelerID", async (req, res) => {
    let traveler_id_status = req.params.travelerID;
    try {
        let data = await MessengerModel.find({traveler_id:traveler_id_status})
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
  });


    /* GET all statuses location based */
    router.get('/:location', async (req, res) => {
        try {
          let data = await MessengerModel.find()
          res.json(data);
      }
      catch (err) {
          console.log(err);
          res.status(400).json(err);
      }
      });

   /* Create a new status */
    router.post("/", authToken, async (req, res) => {
    let validBody = validMessenger(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let status = new MessengerModel(req.body);
        status.traveler_id = req.userData._id;
        await status.save();
        res.status(201).json(status);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

 /* Edit status */
router.put("/:statusEditID",  authToken, async (req, res) => {
    let id_status_edit = req.params.PostEditID;
    let validBody = validMessenger(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let itemEdit = await MessengerModel.updateOne({ _id: id_status_edit, traveler_id: req.userData._id }, req.body);
        res.json(itemEdit);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

/* Delete status */
router.delete("/:statusDeleteID", authToken, async (req, res) => {
    let deleteID = req.params.statusDeleteID;
    try {
        let itemDelete = await MessengerModel.deleteOne({ _id: deleteID /*, user_id: req.userData._id */  });
        res.json(itemDelete);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;