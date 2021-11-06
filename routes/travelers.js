const express = require('express');
const router = express.Router();
const { authToken } = require("../middleware/auth");
const { TravelerModel } = require("../models/travelerModel");

/* GET travelers */
router.get('/', authToken, async (req, res, next) => {
  let qSearch = req.query.s;
  let qRegExp = new RegExp(qSearch, "i");
  let perPage = (req.query.pp) ? Number(req.query.pp) : 50;
  let page = req.query.p;
  let sortQ = (req.query.sort) ? (req.query.sort) : "date_created";
  let ifReverse = (req.query.r == "y") ? -1 : 1;

  try {
    let data = await TravelerModel.find({isActive:true, $or: [{ firstName: qRegExp }, { lastName: qRegExp }, { currentLocation: qRegExp }, { email: qRegExp }]})
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

/* GET traveler by ID */
router.get("/:travelerID", authToken, async (req, res) => {
  let traveler_id = req.params.travelerID;
  try {
      let data = await TravelerModel.findOne({_id:traveler_id})
      res.json(data);
  }
  catch (err) {
      console.log(err);
      res.status(400).json(err);
  }
});

/* Edit traveler */
router.put("/:editID", async (req, res) => {
  let idEedit = req.params.editID;
  let validBody = TravelerModel(req.body);
  if (validBody.error) {
      return res.status(400).json(validBody.error.details);
  }
  try {
      let itemEdit = await TravelerModel.updateOne({ _id: idEedit}, req.body);
      res.json(itemEdit);
  }
  catch (err) {
      console.log(err);
      res.status(400).json(err);
  }
});

module.exports = router;