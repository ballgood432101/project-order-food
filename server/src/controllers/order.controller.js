const { verifyAccessToken } = require("../utils/jwt.util");
const {
  insertRecord,
  updateRecord,
  deleteRecord,
  getRecords,
} = require("../utils/sql.util");
const db = require("../services/db.service");

const getAllOrders = async (req, res) => {
  const result = verifyAccessToken(req);

  const user_id = result.data.user_id;

  // Check if the access token is valid
  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }

  // Define the base query
  let query = `
    SELECT 
      o.order_id,
      o.user_id,
      u.username,
      o.status,
      o.delivery_type,
      o.payment_type,
      o.discount,
      o.total_amount,
      o.created_at AS order_created_at,
      o.updated_at AS order_updated_at,
      oi.order_item_id,
      oi.food_id,
      oi.quantity,
      oi.price,
      oi.created_at AS item_created_at,
      oi.updated_at AS item_updated_at,
      f.food_name,
      f.food_type,
      f.image
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.user_id
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN foods f ON oi.food_id = f.food_id
  `;

  // Modify the query if the user's role is "1"
  if (result.data.role === 1) {
    query += ` WHERE o.user_id = ? ORDER BY o.order_id DESC`;
  } else {
    query += ` ORDER BY o.order_id DESC`;
  }

  try {
    // Execute the query with or without the user_id filter
    const params = result.data.role === 1 ? [user_id] : [];
    const results = await db.query(query, params);

    // Process the results to structure the orders with items
    const orders = results.reduce((acc, row) => {
      const item = {
        food_id: row.food_id,
        food_name: row.food_name,
        food_type: row.food_type,
        image: row.image,
        quantity: row.quantity,
        price: row.price,
      };

      // Find if the order already exists in the accumulator
      const existingOrder = acc.find(
        (order) => order.order_id === row.order_id
      );

      if (existingOrder) {
        existingOrder.items.push(item);
      } else {
        // Create a new order entry
        acc.push({
          order_id: row.order_id,
          user_id: row.user_id,
          username: row.username,
          status: row.status,
          delivery_type: row.delivery_type,
          payment_type: row.payment_type,
          discount: row.discount,
          total_amount: row.total_amount,
          order_created_at: row.order_created_at,
          order_updated_at: row.order_updated_at,
          items: [item],
        });
      }
      return acc;
    }, []);

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const result = verifyAccessToken(req);

  // Check if the access token is valid
  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }

  // Check if the user role is restricted
  if (result.data.role === "1") {
    return res
      .status(403)
      .json({ error: "You don't have permission to update status" });
  }

  const { order_id, status } = req.body;

  if (!order_id || !status) {
    return res.status(400).json({ error: "Missing order_id or status" });
  }

  const query = `
    UPDATE orders 
    SET status = ? 
    WHERE order_id = ?
  `;

  try {
    const result = await db.query(query, [status, order_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllOrders,
  updateOrderStatus,
};
