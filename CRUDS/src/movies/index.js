const express = require("express");
const path = require("path");
const uniqid = require("uniqid");
const { readDB, writeDB } = require("../utils/model");

const router = express.Router();

const moviesFilePath = path.join(__dirname, "movies.json");

router.get("/:id", async (req, res, next) => {
  try {
    const allMovies = await readDB(moviesFilePath);
    const movie = allMovies.filter((movie) => movie._id === req.params.id);
    if(movie.length > 0){
        res.status(200).send(movie)
    } else {
        res.status(404).send("not found")
    }
  } catch (error) {
      console.log(error)
  }
});

router.get("/", async(req, res, next) => {
    try{
        const movies = await readDB(moviesFilePath)
        res.send(movies)
    } catch(error){
        console.log(error)
    }
})

router.post("/", async (req, res, next) => {
  try {
    const moviesDB = await readDB(moviesFilePath);
    const newMovie = {
      _id: uniqid(),
      ...req.body,
      addedAt: new Date(),
    };
    moviesDB.push(newMovie);
    await writeDB(moviesFilePath, moviesDB);
    res.status(201).send(newMovie);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async(req, res, next) => {
    try{
        const moviesDB = await readDB(moviesFilePath)
        const newDB = moviesDB.filter(movies => movies._id !== req.params.id)
        const newMovies = await writeDB(moviesFilePath, newDB);
        res.send(newMovies);
    } catch(error){
        console.log(error)
    }
})

router.put("/:id", async(req, res, next) => {
    try{
        const oldMovies = await readDB(moviesFilePath)
        const newMovies = oldMovies.filter(movie => movie._id !== req.params.id);

        const modifiedMovie = {
            _id: req.params.id,
            ...req.body,
            modifiedAt: new Date()
        }

        newMovies.push(modifiedMovie);
        const finalMovies = await writeDB(moviesFilePath, newMovies);
        res.status(200).send(finalMovies)
    } catch(e){
        console.log(e)
    }
})

module.exports = router