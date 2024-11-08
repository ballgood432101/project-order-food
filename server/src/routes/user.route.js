const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");

/* GET All users. */
router.get("/", userController.get);

// /* POST Create user */

router.post("/", authController.register);

// /* POST Login */
router.post("/login", authController.login);

// /* PUT programming language */
// router.put("/:id", userController.update);

// /* DELETE programming language */
// router.delete("/:id", userController.remove);

module.exports = router;
