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

usersRouter.post("/:id/purchaseHistory/", async (req, res, next) => {
  try {
    const bookId = req.body.bookId
    const purchasedBook = await BookModel.findById(bookId, { _id: 0 })
    const bookToInsert = { ...purchasedBook.toObject(), date: new Date() }

    const updated = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          purchaseHistory: bookToInsert,
        },
      },
      { runValidators: true, new: true }
    )
    res.status(201).send(updated)
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/:id/purchaseHistory/", async (req, res, next) => {
  try {
    const { purchaseHistory } = await UserModel.findById(req.params.id, {
      purchaseHistory: 1,
      _id: 0,
    })
    res.send(purchaseHistory)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

usersRouter.get("/:id/purchaseHistory/:bookId", async (req, res, next) => {
  try {
    const { purchaseHistory } = await UserModel.findOne(
      {
        _id: mongoose.Types.ObjectId(req.params.id),
      },
      {
        _id: 0,
        purchaseHistory: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.bookId) },
        },
      }
    )

    if (purchaseHistory && purchaseHistory.length > 0) {
      res.send(purchaseHistory[0])
    } else {
      next()
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

usersRouter.delete("/:id/purchaseHistory/:bookId", async (req, res, next) => {
  try {
    const modifiedBook = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          purchaseHistory: { _id: mongoose.Types.ObjectId(req.params.bookId) },
        },
      },
      {
        new: true,
      }
    )
    res.send(modifiedBook)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

usersRouter.put("/:id/purchaseHistory/:bookId", async (req, res, next) => {
  try {
    const { purchaseHistory } = await UserModel.findOne(
      {
        _id: mongoose.Types.ObjectId(req.params.id),
      },
      {
        _id: 0,
        purchaseHistory: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.bookId) },
        },
      }
    )

    if (purchaseHistory && purchaseHistory.length > 0) {
      const bookToReplace = { ...purchaseHistory[0].toObject(), ...req.body }

      const modifiedBook = await UserModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(req.params.id),
          "purchaseHistory._id": mongoose.Types.ObjectId(req.params.bookId),
        },
        { $set: { "purchaseHistory.$": bookToReplace } },
        {
          runValidators: true,
          new: true,
        }
      )
      res.send(modifiedBook)
    } else {
      next()
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

module.exports = usersRouter
