const router = require("express").Router();
const bcrypt = require("bcrypt");

// Schema
const User = require("../model/User.js");

// Helper Tools
const { generateRandomPassword, userExists } = require("../helper/helper.js");
const {
  verifyAccessToken,
  signAccessToken,
  signRefreshToken,
} = require("../middlewares/auth-middleware");
const removeInformation = ["-password", "-_id", "-__v"];

// Routes
router.get("/", verifyAccessToken, async (request, resolve) => {
  try {
    const users = await User.find().select(removeInformation);

    if (!users)
      return resolve.status(401).json({
        operation: "failed",
        error: "There are no currently enrolled users.",
      });

    return resolve.status(200).json({ operation: "success", users });
  } catch (error) {
    return resolve
      .status(500)
      .json({ operation: "failed", error: error.message });
  }
});

router.get("/:username", verifyAccessToken, async (request, resolve) => {
  try {
    const { username } = request.params;
    const user = await User.findOne({ username }).select(removeInformation);

    if (!user)
      return resolve.status(401).json({
        operation: "failed",
        error: "User does not exist",
      });

    return resolve.status(200).json({ operation: "success", user });
  } catch (error) {
    return resolve
      .status(500)
      .json({ operation: "failed", error: error.message });
  }
});

router.delete("/:username", verifyAccessToken, async (request, resolve) => {
  try {
    const { username } = request.params;

    const user = await User.findOneAndDelete({ username });
    if (!user)
      return resolve
        .status(401)
        .json({ operation: "failed", error: "User does not exist." });

    return resolve.status(200).json({ operation: "success" });
  } catch (error) {
    return resolve
      .status(500)
      .json({ operation: "failed", error: error.message });
  }
});

router.post("/register", async (request, resolve) => {
  try {
    const { firstName, lastName, email, username, password, role } =
      request.body;

    if (await userExists(email)) {
      return resolve
        .status(409)
        .json({ operation: "invalid", error: "Email already exist." });
    } else {
      const registerUser = await new User({
        firstName,
        lastName,
        email,
        username,
        password,
        role,
      }).save();

      if (registerUser) {
        const accessToken = await signAccessToken(registerUser._id);
        const refreshToken = await signRefreshToken(registerUser._id);

        process.env.JWT_ACCESS_TOKEN = accessToken;
        process.env.JWT_REFRESH_TOKEN = refreshToken;

        return resolve.status(201).json({ operation: "success" });
      } else {
        return resolve
          .status(500)
          .json({ operation: "failed", error: "Failed registering user." });
      }
    }
  } catch (error) {
    return resolve
      .status(500)
      .json({ operation: "failed", error: error.message });
  }
});

router.post("/login", async (request, resolve) => {
  try {
    const { username, password } = request.body;
    const user = await User.findOne({ username });

    if (!user) {
      return resolve
        .status(401)
        .json({ operation: "failed", error: "User does not exist." });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched)
      return resolve
        .status(401)
        .json({ operation: "failed", error: "Invalid credentials." });

    const accessToken = await signAccessToken(user._id);
    const refreshToken = await signRefreshToken(user._id);

    process.env.JWT_ACCESS_TOKEN = accessToken;
    process.env.JWT_REFRESH_TOKEN = refreshToken;

    return resolve.status(200).json({ operation: "success" });
  } catch (error) {
    return resolve
      .status(500)
      .json({ operation: "failed", error: error.message });
  }
});

module.exports = router;
