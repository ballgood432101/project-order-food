const { verifyAccessToken } = require("../utils/jwt.util");
const {
  insertRecord,
  updateRecord,
  deleteRecord,
  getRecords,
} = require("../utils/sql.util");
const db = require("../services/db.service");

const getFavorite = async (req, res) => {
  const result = verifyAccessToken(req);

  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }
  const user_id = result.data.user_id;

  const query = `
      SELECT 
        f.favourite_id,
        f.food_id,
        fd.food_name,
        fd.food_type,
        fd.price,
        fd.image
      FROM favourites f
      JOIN foods fd ON f.food_id = fd.food_id
      WHERE f.user_id = ?;
    `;

  try {
    const response = await db.query(query, [user_id]);

    res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addFavorite = async (req, res) => {
  const result = verifyAccessToken(req);

  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }
  const user_id = result.data.user_id;
  const { food_id } = req.body;

  if (!food_id) {
    return res.status(400).json({ error: "food_id is required" });
  }

  try {
    await insertRecord("favourites", { user_id, food_id });
    const query = `
    SELECT 
      f.favourite_id,
      f.food_id,
      fd.food_name,
      fd.food_type,
      fd.price,
      fd.image
    FROM favourites f
    JOIN foods fd ON f.food_id = fd.food_id
    WHERE f.user_id = ?;
  `;
    const response = await db.query(query, [user_id]);
    res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteFavorite = async (req, res) => {
  const result = verifyAccessToken(req);

  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }

  const user_id = result.data.user_id;

  const favourite_id = req.params.id;

  await deleteRecord("favourites", { favourite_id });

  const query = `
  SELECT 
    f.favourite_id,
    f.food_id,
    fd.food_name,
    fd.food_type,
    fd.price,
    fd.image
  FROM favourites f
  JOIN foods fd ON f.food_id = fd.food_id
  WHERE f.user_id = ?;
`;
  const response = await db.query(query, [user_id]);
  res.status(201).json(response);
};

module.exports = {
  getFavorite,
  addFavorite,
  deleteFavorite,
};
