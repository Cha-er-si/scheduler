const router = require("express").Router();

// Schema
const UserOTP = require("../model/UserOTP");
const User = require("../model/User");

// Helper Tools
const { generateOTP, emailTransporter } = require("../helper/helper");

// Routes
router.get("/otp", async (request, resolve) => {
  try {
    const { username } = request.body;

    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);

    const user = await User.findOne({ username });

    if (!user)
      return resolve
        .status(401)
        .json({ operation: "failed", error: "User does not exist." });

    const userOTPExists = await UserOTP.findOne({ username });

    if (!userOTPExists) {
      const userOTP = await new UserOTP({
        username,
        otp,
        otpExpiration,
      }).save();

      if (!userOTP)
        return resolve
          .status(500)
          .json({ operation: "failed", error: "Failed to generate OTP." });

      await emailTransporter.sendMail({
        from: "noreply.scheduler1331@gmail.com",
        to: user.email,
        subject: "Scheduler OTP Authentication",
        text: `Your OTP is ${otp}. It will expire in ${otpExpiration.toLocaleDateString()} ${otpExpiration.toLocaleTimeString()}.`,
      });

      return resolve
        .status(200)
        .json({ operation: "success", message: "OTP is sent to your email." });
    } else {
      const isExpired = new Date(userOTPExists.otpExpiration) < Date.now();

      if (isExpired) {
        const updateUserOTP = await UserOTP.findOneAndReplace(
          { username },
          { username, otp, otpExpiration }
        );

        if (!updateUserOTP)
          return resolve
            .status(500)
            .json({ operation: "failed", error: "Failed to generate OTP." });

        await emailTransporter.sendMail({
          from: "noreply.scheduler1331@gmail.com",
          to: user.email,
          subject: "Scheduler OTP Authentication",
          text: `Your OTP is ${otp}. It will expire in ${otpExpiration.toLocaleDateString()} ${otpExpiration.toLocaleTimeString()}.`,
        });

        return resolve.status(200).json({
          operation: "success",
          message: "OTP is sent to your email.",
        });
      } else {
        return resolve.status(409).json({
          operation: "invalid",
          message:
            "You already have an OTP sent to your email. Please check your email inbox or spam.",
        });
      }
    }
  } catch (error) {
    return resolve
      .status(500)
      .json({ operation: "failed", error: error.message });
  }
});

module.exports = router;
