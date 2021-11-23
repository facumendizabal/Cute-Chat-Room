const mysql = require("mysql");

const config = require("../config");

const dbconf = {
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
};

// Database connection
function handleConnection() {
  let db = mysql.createConnection(dbconf);

  db.connect((err) => {
    if (err) {
      console.error("[DB ERROR]", err);
      setTimeout(handleConnection, 2000);
    }
    console.log("DB connected succesfully");
  });

  db.on("error", (err) => {
    console.error("[DB ERROR]", err);
    if (
      err.code === "PROTOCOL_CONNECTION_LOST" ||
      err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"
    ) {
      handleConnection();
    } else {
      throw err;
    }
  });

  return db;
}

db = handleConnection();

// Database functions
async function list(table, limit) {
  return new Promise((resolve, reject) => {
    if (limit) {
      db.query(`SELECT * FROM ${table} LIMIT ${limit}`, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    } else {
      db.query(`SELECT * FROM ${table}`, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    }
  });
}

async function get(table, id) {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM ${table} WHERE id="${id}"`, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

async function upsert(table, data) {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO ${table} SET ? ON DUPLICATE KEY UPDATE ?`,
      [data, data],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
}

async function query(table, query) {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM ${table} WHERE ?`, query, (err, result) => {
      if (err) return reject(err);
      if (result[0] === undefined) return resolve({});
      // Format RowDataPacket to object
      result = JSON.parse(JSON.stringify(result[0]));
      resolve(result || null);
    });
  });
}

async function remove(table, id) {
  return new Promise((resolve, reject) => {
    db.query(`DELETE FROM ${table} WHERE id=${id}`, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

async function customQuery(query) {
  return new Promise((resolve, reject) => {
    db.query(query, (err, res) => {
      if (err) return reject(err);
      resolve(res || null);
    });
  });
}

// function query(table, query, join) {
//   let joinQuery = '';
//   if (join) {
//       const key = Object.keys(join);
//       const val = join[key];
//       joinQuery = `JOIN ${key} ON ${table}.${val} = ${key}.id`;
//   }

//   return new Promise((resolve, reject) => {
//       db.query(`SELECT * FROM ${table} ${joinQuery} WHERE ${table}.?`, query, (err, res) => {
//           if (err) return reject(err);
//           resolve(res || null);
//       })
//   })
// }

module.exports = {
  list,
  get,
  upsert,
  remove,
  query,
  customQuery,
};
