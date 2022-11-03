const router = require("express").Router();
const { getUsers } = require("../controllers/users");
const { getUser } = require("../controllers/users");
const { createUser } = require("../controllers/users");

router.use((req, res, next) => {
  if (res.status === 404) {
    res.send({ message: "Requested resource not found" });
  } else {
    next();
  }
});

router.get("/users", getUsers);
router.get("/users/:userId", getUser);
router.post("/users", createUser);

module.exports = router;
