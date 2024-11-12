const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkout.controller");

router.get("/", checkoutController.prepareQR);

router.post("/qrcode", checkoutController.prepareQR2);

router.post("/", checkoutController.checkoutCart);

module.exports = router;
