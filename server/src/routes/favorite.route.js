const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favorite.controller");

router.get("/", favoriteController.getFavorite);

router.post("/", favoriteController.addFavorite);
router.delete("/:id", favoriteController.deleteFavorite);

module.exports = router;
