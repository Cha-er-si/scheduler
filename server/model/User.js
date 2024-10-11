const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcyrpt = require("bcrypt");

const { isPasswordHashed } = require("../helper/helper");

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

User.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

User.pre("save", async function (next) {
  if (this.password !== undefined && !isPasswordHashed(this.password)) {
    let salt = await bcyrpt.genSalt(11);
    let passwordHashed = await bcyrpt.hash(this.password, salt);
    this.password = passwordHashed;
  }

  next();
});

module.exports = mongoose.model("User", User);
