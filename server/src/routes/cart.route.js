const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

/* GET programming languages. */
router.get("/", cartController.getUserCart);

// /* POST programming language */
router.post("/", cartController.addFoodInCart);

// /* PUT programming language */
// router.put("/:id", cartController.updateFood);

// /* DELETE programming language */
router.delete("/:id", cartController.cancelFoodInCart);

// /* DELETE programming language */
router.delete("/", cartController.cancelAllFoodInCart);

module.exports = router;
