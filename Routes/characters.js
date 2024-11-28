const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/characters", async (req, res) => {
  try {
    //en query attendu num de page, search
    console.log(req.query);
    const { page, search, limit } = req.query;
    if (limit) {
      toSkip = (page - 1) * limit;
    } else {
      toSkip = (page - 1) * 100;
    }

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${
        process.env.MARVEL_API_KEY
      }&skip=${toSkip ? toSkip : 0}&name=${search ? search : ""}&limit=${
        limit ? limit : 100
      }`
    );
    console.log(response.data);

    res.status(201).json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
router.get("/character/:characterId", async (req, res) => {
  try {
    const id = req.params.characterId;
    if (!id) {
      return res.status(400).json({ message: "need character Id" });
    }
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/character/${id}/?apiKey=${process.env.MARVEL_API_KEY}`
    );

    res.status(201).json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
router.get("/characterInComics/:characterId", async (req, res) => {
  try {
    const id = req.params.characterId;
    if (!id) {
      return res.status(400).json({ message: "need character Id" });
    }
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${id}/?apiKey=${process.env.MARVEL_API_KEY}`
    );
    res.status(201).json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
