const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const isAuth = require("../middlewares/is-auth");

const feedController = require("../controllers/feed");

router.get("/posts", isAuth, feedController.getPosts);
router.post(
  "/posts",
  isAuth,
  [body("title").isLength({ min: 5 }), body("content").isLength({ min: 10 })],
  feedController.createPost
);
router.get("/post/:postId", isAuth, feedController.getPost);
router.put(
  "/post/:postId",
  [body("title").isLength({ min: 5 }), body("content").isLength({ min: 10 })],
  feedController.updatePost
);
router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
