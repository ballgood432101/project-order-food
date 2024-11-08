const { verifyAccessToken } = require("../utils/jwt.util");
const {
  insertRecord,
  updateRecord,
  deleteRecord,
  getRecords,
} = require("../utils/sql.util");
const db = require("../services/db.service");

const getAllFoods = async (req, res) => {
  // const data = await db.query("SELECT * FROM foods");
  const data = await getRecords("foods");

  return res.status(200).json(data);
};

const createFood = async (req, res) => {
  const result = verifyAccessToken(req);

  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }

  if (result.data.role === "1") {
    return res
      .status(403)
      .json({ error: "You don't have permission to add food" });
  }

  const { food_name, food_type, price } = req.body;

  const food = {
    food_name,
    food_type,
    price,
  };
  await insertRecord("foods", food);
  res.status(201).json({ message: "Food created successfully!" });
};

const updateFood = async (req, res) => {
  const result = verifyAccessToken(req);

  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }

  if (result.data.role === "1") {
    return res
      .status(403)
      .json({ error: "You don't have permission to update food" });
  }

  const { food_id, food_name, food_type, price, image } = req.body;

  const food = {
    food_id,
    food_name,
    food_type,
    price,
    image,
  };
  await updateRecord("foods", food, food.food_id);
  res.status(200).json({ message: "Food updated successfully!" });
};

const deleteFood = async (req, res) => {
  const result = verifyAccessToken(req);

  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }

  if (result.data.role === "1") {
    return res
      .status(403)
      .json({ error: "You don't have permission to delete food" });
  }

  const { food_id } = req.body;

  await deleteRecord("foods", { food_id: food_id });
  res.status(201).json({ message: "Food deleted successfully!" });
};

module.exports = {
  getAllFoods,
  createFood,
  updateFood,
  deleteFood,
};
