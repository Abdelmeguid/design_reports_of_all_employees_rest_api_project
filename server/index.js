//i addbelow lines before upload to Githup
// import dotenv from "dotenv";
// dotenv.config();
//const dotenv = require("dotenv");

const path = require("path");
require("dotenv").config({ path: "./.env" });
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
//const { check } = require("express-validator/check");
//const { body, validationResult } = require("express-validator");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + "-" + file.originalname);
//   },
// });

const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4());
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.get("/", (req, res) => {
//   res.send("Hello, Express!");
// });

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })

  .then((result) => {
    app.use(cors());
    app.use(express.static(path.join(__dirname, "build")));

    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "build", "index.html"));
    });

    app.listen(8080, () => {
      console.log("Server is listening on port 8080");
    });
  })
  .catch((err) => console.log(err));

//i add below for deployment

//i comment below line as per stalkoverflow

// const __dirname2 = path.resolve();
// app.use("/uploads", express.static(path.join(__dirname2, "/uploads")));

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname2, "/client/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname2, "client", "build", "index.html"))
//   );
// }
