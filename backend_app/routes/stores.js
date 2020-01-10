const { Store, validate } = require("../models/store");
const auth = require("../middleware/auth");
const { User } = require("../models/user");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", async (req, res) => {
  const stores = await Store.find().populate("user", "username -_id");

  res.send(stores);
});
router.get("/:id", [auth], async (req, res) => {
  const store = await Store.findById(req.params.id).select({
    name: 1,
    address: 1
  });
  if (!store) {
    res.status(400).send("Store Not Found!");
  }
  res.status(200).send(store);
});
router.get("/user_stores/:userId", [auth], async (req, res) => {
  const stores = await Store.find({ user: req.params.userId });
  res.send(stores);
});
router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let store = await Store.findOne({ name: req.body.name });
  if (store) {
    return res.status(400).send("A store already exists with that name");
  }
  store = new Store({
    name: req.body.name,
    address: req.body.address,
    user: new User({ _id: req.body.user })
  });
  await store.save();
  res.status(201).send(store);
});

router.put("/:id", [auth], async (req, res) => {
  let store = await Store.findById(req.params.id);
  if (!store) {
    return res.status(404).send("Store not found");
  }
  const result = await Store.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        address: req.body.address
      }
    }
  );

  res.status(200).send(store);
});
router.put("/approved/:id", async (req, res) => {
  let store = await Store.findById(req.params.id);
  if (!store) {
    return res.status(404).send("Store not found");
  }
  const result = await Store.updateOne(
    { _id: req.params.id },
    {
      $set: {
        isApproved: req.body.isApproved
      }
    }
  );

  res.status(200).send("Store published request has been approved");
});
router.delete("/:id", [auth], async (req, res) => {
  const store = await Store.deleteOne({ _id: req.params.id });
  res.status(200).send("Store Removed Successfully");
});
module.exports = router;
