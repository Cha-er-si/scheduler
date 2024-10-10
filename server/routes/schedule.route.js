const router = require("express").Router();

// Helper Tools
const { verifyAccessToken } = require("../middlewares/auth-middleware");

// Schema
const Schedule = require("../model/Schedule");
const User = require("../model/User");

// Routes
router.post("/", verifyAccessToken, async (request, resolve) => {
  try {
    const { username, onSiteSchedule } = request.body;

    const user = await User.findOne({ username });
    if (!user)
      return resolve
        .status(401)
        .json({ operation: "failed", error: "User does not exist." });

    const schedule = await Schedule.findOne({ username });
    if (!schedule) {
      const addSchedule = await new Schedule({
        username,
        onSiteSchedule,
      }).save();

      if (!addSchedule)
        return resolve
          .status(500)
          .json({ operation: "success", error: "Failed adding schedule." });

      return resolve.status(201).json({ operation: "success" });
    } else {
      return resolve
        .status(400)
        .json({ operation: "failed", error: "Invalid request." });
    }
  } catch (error) {
    return resolve
      .status(500)
      .json({ operation: "failed", error: error.message });
  }
});

router.patch("/", verifyAccessToken, async (request, resolve) => {
  try {
    const { username, month, days, year } = request.body;

    if (typeof month !== "string" && typeof year !== "string")
      return resolve.status(400).json({
        operation: "failed",
        error:
          "Invalid type of parameter month or year. Expected type is string.",
      });

    if (typeof days !== "object")
      return resolve.status(400).json({
        operation: "failed",
        error: "Invalid type of parameter days. Expected type is object.",
      });

    const user = await User.findOne({ username });
    if (!user)
      return resolve
        .status(401)
        .json({ operation: "failed", error: "User does not exist." });

    const schedule = await Schedule.findOne({ username });
    if (schedule) {
      const updateSchedule = await Schedule.findOneAndUpdate(
        {
          username,
          onSiteSchedule: {
            $elemMatch: {
              month: month,
              year: year,
            },
          },
        },
        {
          $set: {
            "onSiteSchedule.$.days": days,
          },
        }
      );

      if (!updateSchedule)
        return resolve
          .status(500)
          .json({ operation: "success", error: "Failed updating schedule." });

      return resolve.status(201).json({ operation: "success" });
    } else {
      return resolve
        .status(400)
        .json({ operation: "failed", error: "Invalid request." });
    }
  } catch (error) {
    return resolve
      .status(500)
      .json({ operation: "failed", error: error.message });
  }
});

module.exports = router;
