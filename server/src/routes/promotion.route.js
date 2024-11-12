const express = require("express");
const router = express.Router();
const promotionController = require("../controllers/promotion.controller");

router.get("/", promotionController.getAllPromotions);

router.post("/validate", promotionController.validatePromotion);
router.post("/", promotionController.createPromotion);

router.put("/", promotionController.updatePromotion);

router.delete("/:id", promotionController.deletePromotion);

module.exports = router;
