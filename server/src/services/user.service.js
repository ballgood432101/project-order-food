const db = require("./db.service");

async function getAllusers() {
  const res = await db.query("SELECT * FROM users");

  return res;
}

// Create a new user
async function createUser(user) {
  const res = await db.query(
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
    [user.username, user.email, user.password, user.role]
  );

  let message = "Error in creating user";

  if (res.affectedRows) {
    message = "User created successfully";
  }

  return { message };
}

async function login(login) {
  const res = await db.query(
    "SELECT username, password, role FROM users WHERE username = ?",
    [login.username]
  );

  let message = "Error:";

  if (res.length > 0) {
    const user = await res[0]; // Get the first row (assuming 'id' is unique)

    if (user.username === login.username && user.password === login.password) {
      message = "Login success";
      return { message: message, user };
    } else {
      message = "Invalid username or password";
      throw { message };
    }
  } else {
    message = "User not found";
    throw { message };
  }
}

module.exports = {
  getAllusers,
  createUser,
  login,
};
