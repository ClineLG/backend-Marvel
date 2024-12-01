const express = require("express");

const router = express.Router();

const axios = require("axios");

const User = require("../models/User");

const uid2 = require("uid2");

const SHA256 = require("crypto-js/sha256");

const encBase64 = require("crypto-js/enc-base64");

const isAuthenticated = require("../middleware/isAuthenticated");

router.post("/signUp", async (req, res) => {
  try {
    const { username, password, email, avatar } = req.body;
    // console.log(req.body);
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

    const userExist = await User.findOne({ email: email });
    // console.log(userExist);
    if (userExist) {
      return res.status(400).json({ message: "email allready register in DB" });
    }

    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(42);

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
    // console.log(newUser);

    res.status(201).json({ token: newUser.token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/avatar", async (req, res) => {
  try {
    //en query attendu num de page, search
    // console.log(req.query);
    const { page, search } = req.query;

    toSkip = (page - 1) * 37;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${
        process.env.MARVEL_API_KEY
      }&skip=${toSkip ? toSkip : 0}&name=${search ? search : ""}&limit=37`
    );

    // console.log(response.data);

    res.status(201).json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(req.body);
    if (!email || !password) {
      return res.status(400).json({ message: "details needed" });
    }
    isUserExist = await User.findOne({ email: email });

    if (!isUserExist) {
      return res.status(400).json({ message: "address email unknown" });
    }
    const { hash, salt, token } = isUserExist;
    // console.log(isUserExist);
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

router.get("/details", isAuthenticated, async (req, res) => {
  // console.log("coucou");
  try {
    const userDetails = await User.findOne({ _id: req.user._id }).select(
      "account"
    );
    // console.log(userDetails);
    res.status(200).json(userDetails);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.put("/favories", isAuthenticated, async (req, res) => {
  try {
    // console.log("req.body", req.body);
    // req.body._id
    const UsertoUpdate = await User.findById(req.user._id);
    const newTab = [...UsertoUpdate.favories];

    for (let i = 0; i < newTab.length; i++) {
      if (newTab[i]._id === req.body._id) {
        return res.status(400).json({ message: "allready registered" });
      }
    }

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
    // console.log(userFav);
    res.status(200).json(userFav);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/favories/:idFavToDelete", isAuthenticated, async (req, res) => {
  try {
    const userFav = await User.findById(req.user._id).select("favories");
    const newFav = [];

    for (let i = 0; i < userFav.favories.length; i++) {
      if (userFav.favories[i]._id !== req.params.idFavToDelete) {
        newFav.push(userFav.favories[i]);
      }
    }

    userFav.favories = newFav;
    await userFav.save();

    res.status(200).json(userFav);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
