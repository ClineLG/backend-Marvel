const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/comics", async (req, res) => {
  try {
    // console.log(req.query);
    const { page, search, limit } = req.query;
    if (limit) {
      toSkip = (page - 1) * limit;
    } else {
      toSkip = (page - 1) * 100;
    }
    `    toSkip = (page - 1) * 100;`;
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${
        process.env.MARVEL_API_KEY
      }&skip=${toSkip ? toSkip : 0}&title=${search ? search : ""}&limit=${
        limit ? limit : 100
      }`
    );

    res.status(201).json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/comic/:comicId", async (req, res) => {
  try {
    const id = req.params.comicId;
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comic/${id}?apiKey=${process.env.MARVEL_API_KEY}`
    );

    res.status(201).json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
router.get("/comic/characters/:comicId", async (req, res) => {
  try {
    // console.log(req.params);
    const comicToSeek = req.params.comicId;
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.MARVEL_API_KEY}`
    );
    // console.log(response.data.count);
    const numberCharacters = response.data.count;
    // console.log(Math.ceil(numberCharacters / 100));

    const numberOfPages = Math.ceil(numberCharacters / 100); //15
    const tab = [];
    for (let i = 0; i < numberOfPages; i++) {
      const response2 = await axios.get(
        `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${
          process.env.MARVEL_API_KEY
        }&skip=${100 * i}`
      );

      tab.push(response2.data);
    }
    const newTab = [];

    tab.map((e) => {
      e.results.map((elem) => {
        newTab.push(elem);
      });
    });
    // console.log(tab);
    // console.log(newTab);
    const tabCharacterInComic = [];
    newTab.map((character) => {
      character.comics.map((comic) => {
        {
          if (comicToSeek === comic) {
            tabCharacterInComic.push(character);
          }
        }
      });
    });

    res.status(200).json(tabCharacterInComic);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
