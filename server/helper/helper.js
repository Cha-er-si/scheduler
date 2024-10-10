const User = require("../model/User");

const userExists = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() });

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

module.exports = {
  userExists,
  isPasswordNull,
  generateRandomPassword,
};
