const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

/* GET programming languages. */
router.get("/", orderController.getAllOrders);

// /* POST programming language */
// router.post("/", checkoutController.checkoutCart);

// /* PUT programming language */
router.put("/", orderController.updateOrderStatus);

// /* DELETE programming language */
// router.delete("/:id", checkoutController.deleteFood);

module.exports = router;
