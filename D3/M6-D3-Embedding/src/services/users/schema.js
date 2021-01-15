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
  },
  {
    timestamps: true,
  }
)

module.exports = model("User", UserSchema)
