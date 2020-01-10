const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/api/password-reset", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(404)
      .send("Invalid Email Address, Pleae Enter a Vaild Eamil");
  } else {
    const token = crypto.randomBytes(20).toString("hex");
    user.reset_password_token = token;
    user.reset_password_expires = Date.now() + 3600000;
    await user.save();
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "codingerra@gmail.com", // generated ethereal user
        pass: "reactnative" // generated ethereal password
      }
    });
    const mailOptions = {
      from: "codingerra@gmail.com",
      to: `${user.email}`,
      subject: "Link To Reset Password",
      text:
        "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
        "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
        `http://localhost:3000/password-reset-complete/${token}\n\n` +
        "If you did not request this, please ignore this email and your password will remain unchanged.\n"
    };
    // send mail with defined transport object
    const result = await transporter.sendMail(mailOptions);
    if (result) {
      res.status(200).send("Mail has been sent to your account");
    }
  }
});

router.get("/api/password-reset-done/:token", async (req, res) => {
  const user = await User.findOne({ reset_password_token: req.params.token });
  if (!user) {
    return res.status(404).send("Invalid Token");
  }

  res.send(user.email);
});
router.post("/api/password-reset-complete", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(404)
      .send("Invalid Email Address, Please Use a Valid Email Address");
  }
  if (user) {
    user.password = req.body.password;
    user.reset_password_token = null;
    user.reset_password_expires = null;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
  }
  res.status(200).send("Password has been changed successfully!");
});
module.exports = router;
