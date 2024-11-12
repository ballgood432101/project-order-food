const userService = require("../services/user.service");

async function get(req, res, next) {
  try {
    res.json(await userService.getAllusers());
  } catch (err) {
    console.error(`Error while getting users`, err.message);
    next(err);
  }
}

async function create(req, res, next) {
  try {
    res.json(await userService.createUser(req.body));
  } catch (err) {
    console.error(`Error while creating user`, err.message);
    next(err);
  }
}

async function login(req, res, next) {
  try {
    res.json(await userService.login(req.body));
  } catch (err) {
    console.error(`Error: `, err.message);
    next(err);
  }
}

module.exports = {
  get,
  create,
  login,
};
