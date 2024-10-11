const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserOTP = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpiration: {
      type: Date,
      required: true,
    },
  },
  {
    collection: "security",
  }
);

module.exports = mongoose.model("UserOTP", UserOTP);
