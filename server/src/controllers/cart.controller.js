const { verifyAccessToken } = require("../utils/jwt.util");
const {
  insertRecord,
  updateRecord,
  deleteRecord,
  getRecords,
} = require("../utils/sql.util");
const db = require("../services/db.service");

const getUserCart = async (req, res) => {
  const result = verifyAccessToken(req);

  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }

  const data = await db.query(
    "SELECT t2.id, t1.food_id, t1.food_name, t1.price, t1.image, t2.status, t2.quantity FROM foods t1, carts t2 where t2.user_id = ? and t1.food_id = t2.food_id;",
    [result.data.user_id]
  );

  return res.status(200).json(data);
};

// const addFoodInCart = async (req, res) => {
//   const result = verifyAccessToken(req);

//   if (!result.success) {
//     return res.status(403).json({ error: result.error });
//   }

//   const { food_id, status, quantity } = req.body;
//   const user_id = result.data.user_id;

//   const cart = {
//     food_id,
//     status,
//     user_id,
//     quantity,
//   };
//   await insertRecord("carts", cart);
//   res.status(201).json({ message: "Add food in cart successfully!" });
// };

const addFoodInCart = async (req, res) => {
  const result = verifyAccessToken(req);

  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }

  const { id, food_id, status, quantity } = req.body;
  const user_id = result.data.user_id;

  try {
    const existingCartItem = await getRecords("carts", { user_id, food_id });
    if (existingCartItem.length > 0) {
      const updatedQuantity = existingCartItem[0].quantity + 1;
      await updateRecord("carts", { quantity: updatedQuantity }, id);
      const updateRes = await db.query(
        "SELECT t2.id, t1.food_id, t1.food_name, t1.price, t1.image, t2.status, t2.quantity FROM foods t1, carts t2 where t2.user_id = ? and t1.food_id = t2.food_id;",
        [user_id]
      );
      res.status(200).json(updateRes);
    } else {
      const cart = { food_id, status, user_id, quantity };
      await insertRecord("carts", cart);
      const insertRes = await db.query(
        "SELECT t2.id, t1.food_id, t1.food_name, t1.price, t1.image, t2.status, t2.quantity FROM foods t1, carts t2 where t2.user_id = ? and t1.food_id = t2.food_id;",
        [user_id]
      );
      res.status(201).json(insertRes);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while adding food to cart." });
  }
};

// const cancelFoodInCart = async (req, res) => {
//   const result = verifyAccessToken(req);

//   if (!result.success) {
//     return res.status(403).json({ error: result.error });
//   }

//   const id = req.params.id;

//   await deleteRecord("carts", { id: id });
//   res.status(200).json({ message: "Remove food in cart successfully!" });
// };

const cancelFoodInCart = async (req, res) => {
  const result = verifyAccessToken(req);

  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }

  const id = req.params.id;

  const { food_id } = req.body; // Quantity to be removed
  const user_id = result.data.user_id;

  try {
    // Check if the item exists in the cart
    const existingCartItem = await getRecords("carts", { user_id, food_id });

    if (existingCartItem.length < 1) {
      return res.status(404).json({ error: "Food item not found in cart." });
    }

    const updatedQuantity = existingCartItem[0].quantity - 1;
    if (updatedQuantity > 0) {
      // If quantity is still positive, update it
      await updateRecord("carts", { quantity: updatedQuantity }, id);
      res
        .status(200)
        .json({ message: "Reduced food quantity in cart successfully!" });
    } else {
      // If quantity is zero or negative, delete the row
      await deleteRecord("carts", { user_id, food_id });
      res
        .status(200)
        .json({ message: "Removed food item from cart completely!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while updating cart." });
  }
};

const cancelAllFoodInCart = async (req, res) => {
  const result = verifyAccessToken(req);

  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }

  const user_id = result.data.user_id;

  await deleteRecord("carts", { user_id: user_id });
  res.status(200).json({ message: "Remove food in cart successfully!" });
};

module.exports = {
  getUserCart,
  addFoodInCart,
  cancelFoodInCart,
  cancelAllFoodInCart,
};
