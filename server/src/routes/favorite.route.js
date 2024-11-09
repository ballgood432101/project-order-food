const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favorite.controller");

/* GET All users. */
router.get("/", favoriteController.getFavorite);

// /* POST Create user */

router.post("/", favoriteController.addFavorite);

// /* POST Login */
// router.post("/login", authController.login);

// /* PUT programming language */
// router.put("/:id", userController.update);

// /* DELETE programming language */
router.delete("/:id", favoriteController.deleteFavorite);

module.exports = router;
