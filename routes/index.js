const router = require("express").Router();
const userRouter = require("./users");
const clothingRouter = require("./clothingItems");
const likesRouter = require("./likes");

router.use("/users", userRouter);
router.use("/items", clothingRouter, likesRouter);

module.exports = router;
