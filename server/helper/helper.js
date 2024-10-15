const crypto = require("crypto");
const nodemailer = require("nodemailer");

const userExists = async (email) => {
  const User = require("../model/User");
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  console.log(user);

  if (user) {
    return true;
  } else {
    return false;
  }
};

const isPasswordNull = (password) => {
  if (password == "") {
    return false;
  } else if (password == null) {
    return false;
  } else {
    return true;
  }
};

const generateRandomPassword = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";

  let password = "";

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }

  return password;
};

const isPasswordHashed = (password) => {
  const bcryptPattern = /^\$2[aby]\$\d{2}\$.{53}$/;
  return bcryptPattern.test(password);
};

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const emailAddress = "noreply.scheduler1331@gmail.com";

const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailAddress,
    pass: "jexgkrxqzswegiwg",
  },
});

module.exports = {
  userExists,
  isPasswordNull,
  generateRandomPassword,
  isPasswordHashed,
  generateOTP,
  emailTransporter,
  emailAddress,
};
