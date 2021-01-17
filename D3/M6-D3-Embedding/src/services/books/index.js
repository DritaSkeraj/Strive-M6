const express = require("express")
const q2m = require("query-to-mongo")

const BookModel = require("./schema")

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
    //total => how many pages that meet the criteria we will have
    const total = await BookModel.countDocuments(query.criteria)

    //for the pagination 1.sort, 2.skip, 3.limit
    const books = await BookModel.find(query.criteria, query.options.fields)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort)
    res.send({ links: query.links("/books", total), books })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

booksRouter.get("/:id", async (req, res, next) => {
  try {
    const book = await BookModel.findById(req.params.id)
    res.send(book)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

booksRouter.put("/:id", async (req, res, next) => {
  try {
    const modifiedBook = await BookModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    )
    if (modifiedBook) {
      res.send(modifiedBook)
    } else {
      next()
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

booksRouter.delete("/:id", async (req, res, next) => {
  try {
    const book = await BookModel.findByIdAndDelete(req.params.id)
    if (book) {
      res.send(book)
    } else {
      next()
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

module.exports = booksRouter
