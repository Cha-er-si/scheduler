require("dotenv").config();
const jwt = require("jsonwebtoken");

signAccessToken = (userID) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        user_id: userID,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "5m" },
      (error, token) => {
        if (error) return reject({ error: error.message });

        return resolve(token);
      }
    );
  });
};

verifyAccessToken = (request, resolve, next) => {
  request.headers["authorization"] = "Bearer " + process.env.JWT_ACCESS_TOKEN;

  if (!request.headers["authorization"])
    return next(resolve.json({ error: "Unauthorized." }));

  const authHeader = request.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, (error, payload) => {
    if (error) {
      const message =
        error.name === "JsonWebTokenError" ? "Unauthorized" : error.message;

      if (error.name == "JsonWebTokenError") {
        return resolve.json({ operation: "failed", error: message });
      } else {
        return resolve.json({ operation: "expired", error: message });
      }
    }

    request.payload = payload;
    next();
  });
};

signRefreshToken = (userID) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        user_id: userID,
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: "15s" },
      (error, token) => {
        if (error) return reject({ error: error.message });

        return resolve(token);
      }
    );
  });
};

verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_TOKEN, (error, payload) => {
      if (error) return reject({ error: error.message });

      const userID = payload.user_id;
      resolve(userID);
    });
  });
};

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
