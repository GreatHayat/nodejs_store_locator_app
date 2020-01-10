const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { User, validate } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", [auth], async (req, res) => {
  const users = await User.find();
  res.send(users);
});
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select({
    username: 1,
    email: 1,
    first_name: 1,
    last_name: 1,
    company: 1
  });
  if (!user) {
    return res.status(404).send("User With That ID Doesn't Exists...");
  }
  res.status(200).send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("User Already Registered With that Email...");
  }

  user = new User(
    _.pick(req.body, [
      "first_name",
      "last_name",
      "username",
      "email",
      "company",
      "password",
      "isAgree",
      "isAdmin"
    ])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send(_.pick(user, ["username", "email"]));
});

router.put("/:id", async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send("User Doesn't Exists With That ID");
  }
  const result = await User.updateOne(
    { _id: req.params.id },
    {
      $set: {
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        company: req.body.company
      }
    }
  );

  res.status(200).send("Profile Updated Successfully!");
});
router.delete("/:id", [auth], async (req, res) => {
  const user = await User.findByIdAndRemove({ _id: req.params.id });
  if (!user) {
    return res.status(404).send("User With That ID Doesn't Exists...");
  }
  res.status(200).send(user);
});

module.exports = router;
