const PORT = 8880;
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
// graphql setup
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

require("dotenv").config();
const app = express();

// file upload configuration
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(cors());
app.use(express.json());
app.use(multer({ storage: fileStorage }).single("image"));
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);
// graphql route
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
  })
);

// hande errors
app.use((error, req, res, next) => {
  const { message, statusCode, data } = error;
  res.status(statusCode || 501).json({
    message,
    data,
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then((esult) => {
    app.listen(PORT, () => {
      console.log("App started working!");
    });
  })
  .catch((err) => {
    console.log(err);
  });
