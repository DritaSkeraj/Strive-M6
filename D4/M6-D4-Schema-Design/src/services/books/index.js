const express = require("express")
const q2m = require("query-to-mongo")
const BookModel = require("../books/schema")

const booksRouter = express.Router()

booksRouter.post("/", async (req, res, next) => {
  try {
    const newBook = new BookModel(req.body)

    const { _id } = await newBook.save()
    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})

booksRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query)
    const total = await BookModel.countDocuments(query.criteria)
    const books = await BookModel.find(query.criteria)
      .sort(query.options.sort)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .populate("authors")

    res.send({ links: query.links("/books", total), books })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

booksRouter.get("/:id", async (req, res, next) => {
  try {
    const book = await BooksModel.findBookWithAuthors(req.params.id)
    res.send(book)
  } catch (error) {
    next(error)
  }
})

module.exports = booksRouter
