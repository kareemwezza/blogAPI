const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeaders = req.get("Authorization");
  if (!authHeaders) {
    const error = new Error("Not Authanticated");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeaders.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "Hello from wezza server");
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not Authorized.");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
