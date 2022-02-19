const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleError = require("../utils/errorHandler");

exports.signup = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed.");
    error.data = errors.array();
    error.statusCode = 422;
    throw error;
  }
  bcrypt
    .hash(password, 12)
    .then((hashedPS) => {
      const user = new User({ name, email, password: hashedPS });
      return user.save();
    })
    .then((user) => {
      res
        .status(201)
        .json({ message: "User created successfuly", userId: user._id });
    })
    .catch((err) => handleError(err, next));
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("No such User found");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Incorrect password!");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: email,
          userId: loadedUser._id.toString(),
        },
        "Hello from wezza server",
        { expiresIn: "1h" }
      );
      res.status(200).json({ token, userId: loadedUser._id.toString() });
    })
    .catch((err) => handleError(err, next));
};
