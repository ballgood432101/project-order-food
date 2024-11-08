const mysql = require("mysql");
const config = require("../configs/db.config");
const pool = mysql.createPool(config);

const createTable = (schema) => {
  return new Promise((resolve, reject) => {
    pool.query(schema, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const checkRecordExists = (tableName, column, value) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${tableName} WHERE ${column} = ?`;

    pool.query(query, [value], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results[0] : null);
      }
    });
  });
};

const getRecords = (tableName, filter = null) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM ${tableName}`;
    const params = [];

    if (filter) {
      const conditions = Object.keys(filter)
        .map((key) => `${key} = ?`)
        .join(" AND ");
      query += ` WHERE ${conditions}`;
      params.push(...Object.values(filter));
    }

    pool.query(query, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const insertRecord = (tableName, record) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO ${tableName} SET ?`;

    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const updateRecord = (tableName, record, id) => {
  const idData = extractId(tableName);
  return new Promise((resolve, reject) => {
    const query = `UPDATE ${tableName} SET ? WHERE ${idData} = ?`;

    pool.query(query, [record, id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const deleteRecord = (tableName, filter = null) => {
  return new Promise((resolve, reject) => {
    let query = `DELETE FROM ${tableName}`;
    const params = [];

    if (filter) {
      const conditions = Object.keys(filter)
        .map((key) => `${key} = ?`)
        .join(" AND ");
      query += ` WHERE ${conditions}`;
      params.push(...Object.values(filter));
    }

    pool.query(query, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const extractId = (tableName) => {
  let idData = "id";

  switch (tableName) {
    case "users":
      idData = "user_id";
      break;
    case "foods":
      idData = "food_id";
      break;
    case "favourite":
      idData = "favourite_id";
      break;
    case "orders":
      idData = "order_id";
      break;
    case "promotions":
      idData = "promotion_id";
      break;
    default:
      idData = "id";
      break;
  }
  return idData;
};

module.exports = {
  createTable,
  checkRecordExists,
  getRecords,
  insertRecord,
  updateRecord,
  deleteRecord,
};
