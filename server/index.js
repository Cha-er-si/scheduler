require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database connected successfully");
      app.listen(port, () => {
        console.log("Listening on port " + port);
      });
    },
    (error) => {
      console.log("Database could not be connected: " + error);
    }
  );

// Express Configuration
app.use(
  cors({
    origin: "http://localhost:8100",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
const userRoutes = require("./routes/user.route.js");
const scheduleRoutes = require("./routes/schedule.route.js");
const securityRoutes = require("./routes/security.route.js");

// Use Routes
app.use("/users", userRoutes);
app.use("/schedules", scheduleRoutes);
app.use("/security", securityRoutes);
