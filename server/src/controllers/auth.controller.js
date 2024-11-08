const bcrypt = require("bcryptjs");
const { checkRecordExists, insertRecord } = require("../utils/sql.util");
const { generateAccessToken } = require("../utils/jwt.util");

const register = async (req, res, next) => {
  const { username, password, email, role } = req.body;
  if (!username || !password) {
    res
      .status(400)
      .json({ error: "Username or Password fields cannot be empty!" });
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = {
    username,
    password: hashedPassword,
    email,
    role,
  };
  try {
    const usernameAlreadyExists = await checkRecordExists(
      "users",
      "username",
      username
    );
    const emailAlreadyExists = await checkRecordExists("users", "email", email);
    if (usernameAlreadyExists) {
      res.status(409).json({ error: "Username already exists" });
    } else if (emailAlreadyExists) {
      res.status(409).json({ error: "Email already exists" });
    } else {
      await insertRecord("users", user);
      res.status(201).json({ message: "User created successfully!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res
      .status(400)
      .json({ error: "Username or Password fields cannot be empty!" });
    return;
  }

  try {
    const existingUser = await checkRecordExists("users", "username", username);

    if (existingUser) {
      if (!existingUser.password) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (passwordMatch) {
        res.status(200).json({
          user_id: existingUser.user_id,
          username: existingUser.username,
          email: existingUser.email,
          role: existingUser.role,
          access_token: generateAccessToken({
            user_id: existingUser.user_id,
            username: existingUser.username,
            email: existingUser.email,
            role: existingUser.role,
          }),
        });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
};
