const { verifyAccessToken } = require("../utils/jwt.util");
const {
  insertRecord,
  updateRecord,
  deleteRecord,
  getRecords,
} = require("../utils/sql.util");
const db = require("../services/db.service");

const getAllPromotions = async (req, res) => {
  const data = await getRecords("promotions");

  return res.status(200).json(data);
};

const createPromotion = async (req, res) => {
  const result = verifyAccessToken(req);

  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }

  if (result.data.role === "1") {
    return res
      .status(403)
      .json({ error: "You don't have permission to create promotion" });
  }

  const { discount, promotion_code } = req.body;

  const promotion = {
    discount,
    promotion_code,
  };

  try {
    await insertRecord("promotions", promotion);

    res.status(201).json({ message: "Created promotion successfully!" });
  } catch (error) {
    console.error("Error creating promotion:", error);
    res.status(500).json({ error: "Failed to create promotion" });
  }
};

const updatePromotion = async (req, res) => {
  const result = verifyAccessToken(req);

  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }

  if (result.data.role === "1") {
    return res
      .status(403)
      .json({ error: "You don't have permission to update promotion" });
  }

  const { promotion_id, discount, promotion_code } = req.body;

  if (!promotion_id || !discount || !promotion_code) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const promotion = { discount, promotion_code };
    const result = await updateRecord("promotions", promotion, promotion_id);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Promotion not found" });
    }

    res.status(200).json({ message: "Promotion updated successfully!" });
  } catch (error) {
    console.error("Error updating promotion:", error);
    res.status(500).json({ error: "Failed to update promotion" });
  }
};

const deletePromotion = async (req, res) => {
  const result = verifyAccessToken(req);

  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }

  if (result.data.role === "1") {
    return res
      .status(403)
      .json({ error: "You don't have permission to delete promotions" });
  }

  const promotion_id = req.params.id;

  if (!promotion_id) {
    return res.status(400).json({ error: "Missing required param" });
  }

  try {
    const result = await deleteRecord("promotions", { promotion_id });

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Promotion not found" });
    }

    res.status(200).json({ message: "Promotion deleted successfully!" });
  } catch (error) {
    console.error("Error deleting promotion:", error);
    res.status(500).json({ error: "Failed to delete promotion" });
  }
};

const validatePromotion = async (req, res) => {
  const result = verifyAccessToken(req);

  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }

  if (result.data.role === "1") {
    return res
      .status(403)
      .json({ error: "You don't have permission to delete promotions" });
  }

  const { promotion_code } = req.body;

  try {
    const query = "SELECT discount FROM promotions WHERE promotion_code = ?";
    const result = await db.query(query, [promotion_code]);

    if (result.length > 0) {
      return res.json({ valid: true, discount: result[0].discount });
    } else {
      return res.json({ valid: false, message: "Invalid promotion code" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error validating promotion code" });
  }
};

module.exports = {
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  validatePromotion,
};
