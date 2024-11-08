const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const verifyAccessToken = (headers) => {
  const secret = process.env.JWT_SECRET;

  const authHeader = headers.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return { success: false, error: "No token found" };
  }

  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
};
