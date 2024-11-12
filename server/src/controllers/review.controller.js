const { verifyAccessToken } = require("../utils/jwt.util");
const { insertRecord, getRecords } = require("../utils/sql.util");
const db = require("../services/db.service");

const getAllReviews = async (req, res) => {
  const data = await getRecords("comments");

  return res.status(200).json(data);
};

const createReview = async (req, res) => {
  const result = verifyAccessToken(req);

  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }

  const { ratings, other_comments, order_id } = req.body;
  const user_id = result.data.user_id;

  const ratingMap = {
    Quality: "quality",
    Service: "service",
    Delivery: "delivery",
    Valueable: "valuable",
  };

  const reviewData = ratings.reduce((acc, rating) => {
    const column = ratingMap[rating.label];
    if (column) {
      acc[column] = rating.rating;
    }
    return acc;
  }, {});

  reviewData.other_comments = other_comments;
  reviewData.user_id = user_id;
  reviewData.order_id = order_id;
  reviewData.created_at = new Date();

  try {
    await insertRecord("comments", reviewData);
    await updateOrderIsReviewed(order_id);

    res
      .status(201)
      .json({ message: "Review created and order updated successfully!" });
  } catch (error) {
    console.error("Error creating review or updating order:", error);
    res.status(500).json({ error: "Failed to create review or update order" });
  }
};

const updateOrderIsReviewed = async (order_id) => {
  const query = `UPDATE orders SET is_reviewed = TRUE WHERE order_id = ?`;

  try {
    await db.query(query, [order_id]);
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

module.exports = {
  getAllReviews,
  createReview,
};
