const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

router.get("/", orderController.getAllOrders);

router.put("/", orderController.updateOrderStatus);

module.exports = router;
