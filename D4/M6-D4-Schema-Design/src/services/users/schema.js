const { Schema, model } = require("mongoose")

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: String,
    email: String,
    age: {
      type: Number,
      min: [18, "tooooooooooo young"],
      max: 65,
      default: 18,
    },
    professions: [String],
    purchaseHistory: [
      {
        asin: String,
        title: String,
        price: Number,
        category: String,
        date: Date,
      },
    ],
    cart: [
      {
        title: String,
        category: String,
        price: Number,
        authors: [
          { _id: Schema.Types.ObjectId, name: String, surname: String },
        ],
        quantity: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
)

UserSchema.static("findBookInCart", async function (id, bookId) {
  const isBookThere = await UserModel.findOne({
    _id: id,
    "cart._id": bookId,
  })
  return isBookThere
})

UserSchema.static(
  "incrementCartQuantity",
  async function (id, bookId, quantity) {
    await UserModel.findOneAndUpdate(
      {
        _id: id,
        "cart._id": bookId,
      },
      { $inc: { "cart.$.quantity": quantity } }
    )
  }
)

UserSchema.static("addBookToCart", async function (id, book) {
  await UserModel.findOneAndUpdate(
    { _id: id },
    {
      $addToSet: { cart: book },
    }
  )
})

UserSchema.static("calculateCartTotal", async function (id) {
  const { cart } = await UserModel.findById(id)
  return cart
    .map(book => book.price * book.quantity)
    .reduce((acc, el) => acc + el, 0)
})

const UserModel = model("User", UserSchema)

module.exports = UserModel
