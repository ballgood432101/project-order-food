const db = require("./db.service");

async function getAllFoods() {
  const res = await db.query("SELECT * FROM foods");

  return res;
}

async function createFood(food) {
  const res = await db.query(
    "INSERT INTO foods (food_name, food_type, price) VALUES (?, ?, ?)",
    [food.food_name, food.food_type, food.price]
  );

  let message = "Error in creating food";

  if (res.affectedRows) {
    message = "Food created successfully";
  }

  return { message };
}
module.exports = {
  getAllFoods,
  createFood,
};
