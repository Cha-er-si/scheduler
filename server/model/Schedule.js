const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Schedule = new Schema(
  {
    username: {
      type: String,
      unique: [true, "Username already exists."],
    },
    onSiteSchedule: [
      new Schema(
        {
          month: {
            type: String,
            required: true,
          },
          days: {
            type: [String],
            required: true,
          },
          year: {
            type: String,
            required: true,
          },
        },
        {
          _id: false,
        }
      ),
    ],
  },
  {
    collection: "schedules",
  }
);

module.exports = mongoose.model("Schedule", Schedule);
