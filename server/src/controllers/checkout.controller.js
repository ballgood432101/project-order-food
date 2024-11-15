const { verifyAccessToken } = require("../utils/jwt.util");
const { deleteRecord } = require("../utils/sql.util");
const db = require("../services/db.service");

const thPromptpayQr = require("th-promptpay-qr");

const prepareQR = async (req, res) => {
  const result = verifyAccessToken(req);

  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }
  const userId = result.data.user_id;
  thPromptpayQr.getQRCodePNG("0917057319", 1, (err, png) => {
    return res.status(200).json({ qrcode: png });
  });
};

const prepareQR2 = async (req, res) => {
  const result = verifyAccessToken(req);

  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }
  const { total_amount } = req.body;

  if (!total_amount) {
    return res.status(422).json({ error: "Invalid amount" });
  }

  thPromptpayQr.getQRCodePNG("0917057319", total_amount, (err, png) => {
    return res.status(200).json({ qrcode: png });
  });
};

const checkoutCart = async (req, res) => {
  const result = verifyAccessToken(req);

  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }
  const userId = result.data.user_id;

  const { deliveryType, paymentType, discount, items } = req.body;

  try {
    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Cart is empty or items is not an array" });
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Insert a new order
    const insertOrderQuery = `
      INSERT INTO orders (user_id, status, delivery_type, payment_type, discount, total_amount) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const orderResult = await db.query(insertOrderQuery, [
      userId,
      "pending",
      deliveryType,
      paymentType,
      discount || 0,
      totalAmount,
    ]);

    const orderId = orderResult.insertId;

    const orderItemsData = items.map((item) => [
      orderId,
      item.food_id,
      item.quantity,
      item.price,
    ]);

    if (orderItemsData.length === 0) {
      return res.status(400).json({ message: "No items to insert" });
    }

    const insertOrderItemsQuery = `
      INSERT INTO order_items (order_id, food_id, quantity, price) 
      VALUES (?, ?, ?, ?)
    `;

    await items.forEach((item) => {
      db.query(insertOrderItemsQuery, [
        orderId,
        item.food_id,
        item.quantity,
        item.price,
      ]);
    });

    await deleteRecord("carts", { user_id: userId });

    return res.json({
      message: "Order placed successfully",
      orderId,
      totalAmount,
      totalItems: items.length,
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  checkoutCart,
  prepareQR,
  prepareQR2,
};
