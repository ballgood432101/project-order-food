const express = require("express");
const router = express.Router();
const foodController = require("../controllers/food.controller");

/* GET programming languages. */
router.get("/", foodController.getAllFoods);

// /* POST programming language */
router.post("/", foodController.createFood);

// /* PUT programming language */
router.put("/:id", foodController.updateFood);

// /* DELETE programming language */
router.delete("/:id", foodController.deleteFood);

module.exports = router;
