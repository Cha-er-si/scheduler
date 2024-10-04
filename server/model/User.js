const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcyrpt = require("bcrypt");

let User = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: [true, "Email already exists."],
      required: true,
    },
    username: {
      type: String,
      unique: [true, "Username already exists."],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  {
    collection: "users",
  }
);

User.pre("save", async function (next) {
  let salt = await bcyrpt.genSalt(11);
  let passwordHashed = await bcyrpt.hash(this.password, salt);
  this.password = passwordHashed;
  next();
});

module.exports = mongoose.model("User", User);
