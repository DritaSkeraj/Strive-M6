const { Schema } = require("mongoose")
const mongoose = require("mongoose")
//const mongoosePaginate = require("mongoose-paginate-v2")

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    age: {
      type: Number,
      min: [18, "You are too young!"],
      max: 65,
      default: 18,
    },
    professions: [String],
  },
  { timestamps: true }
)

//UserSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("User", UserSchema)//bounded to Users collection
