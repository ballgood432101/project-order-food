const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

router.get("/", cartController.getUserCart);

router.post("/", cartController.addFoodInCart);

router.delete("/:id", cartController.cancelFoodInCart);
router.delete("/", cartController.cancelAllFoodInCart);

module.exports = router;
