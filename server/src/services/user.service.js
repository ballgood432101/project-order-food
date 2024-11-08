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

// // Update an existing user
// async function updateUser() {
//   app.put("/api/users/:id", (req, res) => {
//     const { username, email } = req.body;
//     const userId = req.params.id;
//     db.query(
//       "UPDATE users SET username = ?, email = ? WHERE id = ?",
//       [username, email, userId],
//       (err, result) => {
//         if (err) {
//           console.error("Error executing query: " + err.stack);
//           res.status(400).send("Error updating user");
//           return;
//         }
//         res.send("User updated successfully");
//       }
//     );
//   });
// }

// // Delete a user
// async function deleteUser() {
//   app.delete("/api/users/:id", (req, res) => {
//     const userId = req.params.id;
//     db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
//       if (err) {
//         console.error("Error executing query: " + err.stack);
//         res.status(400).send("Error deleting user");
//         return;
//       }
//       res.send("User deleted successfully");
//     });
//   });
// }

module.exports = {
  getAllusers,
  createUser,
  login,
};
