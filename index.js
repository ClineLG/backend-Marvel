const express = require("express");

const cors = require("cors");

const mongoose = require("mongoose");

const app = express();
app.use(cors());

require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI);

app.use(express.json());

const userRoutes = require("./Routes/user.js");
app.use("/user", userRoutes);

const charactersRoutes = require("./Routes/characters.js");
app.use(charactersRoutes);

const comicsRoutes = require("./Routes/comics.js");
app.use(comicsRoutes);

app.get("/", (req, res) => {
  try {
    return res.status(200).json("Welcome on Marvel Server");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "you seem lost..." });
});

app.listen(process.env.PORT, () => {
  console.log("server is running 🤘");
});
