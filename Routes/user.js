const express = require("express");

const router = express.Router();

const User = require("../models/User");

const uid2 = require("uid2");

const SHA256 = require("crypto-js/sha256");

const encBase64 = require("crypto-js/enc-base64");

const isAuthenticated = require("../middleware/isAuthenticated");

router.post("/signUp", async (req, res) => {
  try {
    const { username, password, email, avatar } = req.body;
    if (
      !username ||
      username === "" ||
      !password ||
      password === "" ||
      !email ||
      email === ""
    ) {
      return res.status(400).json({ message: "Parameters missing" });
    }
    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(42);

    //call n2 de front pour choisir photo call /characters : perso photo send , pouvoir choisir photo

    const newUser = new User({
      email: email,
      account: {
        username: username,
        avatar: avatar,
      },
      token: token,
      hash: hash,
      salt: salt,
    });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "details needed" });
    }
    isUserExist = await User.findOne({ email: email });

    if (!isUserExist) {
      return res.status(400).json({ message: "address email unknown" });
    }
    const { hash, salt, token } = isUserExist;

    const testingPassword = SHA256(password + salt).toString(encBase64);

    if (testingPassword !== hash) {
      return res.status(400).json({ message: "Wrong password" });
    } else {
      res.status(201).json(token);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.put("/favories", isAuthenticated, async (req, res) => {
  try {
    console.log(req.body);
    const UsertoUpdate = await User.findById(req.user._id);
    const newTab = [...UsertoUpdate.favories];

    UsertoUpdate.favories.push(req.body);
    await UsertoUpdate.save();
    // console.log("UserToUpdate", UsertoUpdate);

    res.status(200).json(UsertoUpdate.favories);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/favories", isAuthenticated, async (req, res) => {
  try {
    const userFav = await User.findById(req.user._id).select("favories");

    res.status(200).json(userFav);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
