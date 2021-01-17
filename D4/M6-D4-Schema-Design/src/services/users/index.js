const express = require("express")
const mongoose = require("mongoose")
const UserModel = require("./schema")
const BookModel = require("../books/schema")

const usersRouter = express.Router()

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body)

    const { _id } = await newUser.save()
    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find()
    res.send(users)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

usersRouter.get("/:id", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id)
    res.send(user)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

usersRouter.put("/:id", async (req, res, next) => {
  try {
    const modifiedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    )
    if (modifiedUser) {
      res.send(modifiedUser)
    } else {
      next()
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

usersRouter.delete("/:id", async (req, res, next) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id)
    if (user) {
      res.send(user)
    } else {
      next()
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

usersRouter.post("/:id/purchaseHistory", async (req, res, next) => {
  // add a book to the purchase history of the specified user
  try {
    const bookID = req.body.bookID

    const purchasedBook = await BookModel.findById(bookID, { _id: 0 })

    console.log(purchasedBook)

    const bookToInsert = { ...purchasedBook.toObject(), date: new Date() }

    // add the book to the purchaseHistory array

    //   update(
    //     { _id: 1 },
    //     { $push: { scores: 89 } }
    //  )
    const modifiedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: { purchaseHistory: bookToInsert },
      },
      { runValidators: true, new: true }
    )
    res.send(modifiedUser)
  } catch (error) {
    console.log(error)
  }
})

usersRouter.get("/:id/purchaseHistory", async (req, res, next) => {
  // retrieve the entire purchase history of the specified user
  try {
    const { purchaseHistory } = await UserModel.findById(req.params.id, {
      purchaseHistory: 1,
      _id: 0,
    })
    res.send(purchaseHistory)
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/:id/purchaseHistory/:bookId", async (req, res, next) => {
  // retrieve a specific book from the purchase history of the specified user
  try {
    const { purchaseHistory } = await UserModel.findOne(
      { _id: mongoose.Types.ObjectId(req.params.id) }, // converts id as a string into id as an ObjectId
      {
        // projection
        purchaseHistory: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.bookId) }, // returns just the element of the array that matches this _id condition
        },
      }
    )
    console.log(purchaseHistory)
    res.send(purchaseHistory[0])
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/:id/purchaseHistory/:bookId", async (req, res, next) => {
  // remove a specific book from the purchase history of the specified user
  try {
    // { $pull: { results: { score: 8 , item: "B" } } }
    const modifiedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          purchaseHistory: { _id: mongoose.Types.ObjectId(req.params.bookId) }, // I need to specify a criteria to tell mongo which element of purchaseHistory needs to be removed. This criteria is to match _id
        },
      },
      {
        runValidators: true,
        new: true,
      }
    )
    res.send(modifiedUser)
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/:id/purchaseHistory/:bookId", async (req, res, next) => {
  // modify a specific book from the purchase history of the specified user

  try {
    // Find that book
    const { purchaseHistory } = await UserModel.findOne(
      { _id: mongoose.Types.ObjectId(req.params.id) }, // converts id as a string into id as an ObjectId
      {
        // projection
        purchaseHistory: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.bookId) }, // returns just the element of the array that matches this _id condition
        },
      }
    )
    const oldBook = purchaseHistory[0].toObject()

    const modifiedBook = { ...oldBook, ...req.body } // merging old stuff (thatBook) with new stuff (req.body)

    console.log("OLD BOOK ", oldBook)
    console.log("MODIFIED BOOK ", modifiedBook)
    // Modify the user's purchase history by replacing that book with modifiedBook

    await UserModel.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.params.id), // I'm not just targeting the user itself
        "purchaseHistory._id": mongoose.Types.ObjectId(req.params.bookId), // here I'm targeting also the very specific book (Mongo will keep in memory the position of that book, it is going to be saved inside the $ )
      },
      { $set: { "purchaseHistory.$": modifiedBook } } // .$ it is representing the position of the book targeted in the query
    ) // if I'm using findByIdAndUpdate I will be retrieving the entire user. Here I prefer to target the specific book of that user
  } catch (error) {}
})

usersRouter.post("/:id/add-to-cart/:bookId", async (req, res, next) => {
  try {
    const book = await BookModel.decreaseBookQuantity(
      req.params.bookId,
      req.body.quantity
    )
    if (book) {
      const newBook = { ...book.toObject(), quantity: req.body.quantity }

      const isBookThere = await UserModel.findBookInCart(
        req.params.id,
        req.params.bookId
      )
      if (isBookThere) {
        await UserModel.incrementCartQuantity(
          req.params.id,
          req.params.bookId,
          req.body.quantity
        )
        res.send("Quantity incremented")
      } else {
        await UserModel.addBookToCart(req.params.id, newBook)
        res.send("New book added!")
      }
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/:id/calculate-cart-total", async (req, res, next) => {
  try {
    const total = await UserModel.calculateCartTotal(req.params.id)
    res.send({ total })
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
