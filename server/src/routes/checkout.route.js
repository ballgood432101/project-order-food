const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkout.controller");

/* GET programming languages. */
router.get("/", checkoutController.prepareQR);

router.post("/qrcode", checkoutController.prepareQR2);

// /* POST programming language */
router.post("/", checkoutController.checkoutCart);

// /* PUT programming language */
// router.put("/:id", checkoutController.updateFood);

// /* DELETE programming language */
// router.delete("/:id", checkoutController.deleteFood);

module.exports = router;
