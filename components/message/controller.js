const auth = require("../auth");
const error = require("../../utils/error");
const TABLE = "message";

module.exports = function (injectedStore) {
  let store = injectedStore;

  async function list(limit = "") {
    if (limit) {
      limit = `LIMIT ${limit}`;
    }

    let response = await store.customQuery(
      `SELECT message.id, message.text, message.created_at, message.user_from, user.username   
      FROM ${TABLE}
      JOIN user ON ${TABLE}.user_from = user.id
      ORDER BY created_at ASC
      ${limit}`
    );
    response = JSON.parse(JSON.stringify(response));

    // is this reliable
    response.forEach((r, i) => {
      response[i] = {
        id: r.id,
        text: r.text,
        created_at: r.created_at,
        user_from: {
          id: r.user_from,
          username: r.username,
        },
      };
    });

    return response;
  }

  async function get(id) {
    let response = await store.customQuery(
      `SELECT message.id, message.text, message.created_at, message.user_from, user.username   
      FROM ${TABLE}
      JOIN user ON ${TABLE}.user_from = user.id
      WHERE message.id = ${id}`
    );
    
    response = JSON.parse(JSON.stringify(response));

    return {
      id: response[0].id,
      text: response[0].text,
      created_at: response[0].created_at,
      user_from: {
        id: response[0].user_from,
        username: response[0].username,
      },
    };
  }

  async function upsert(userFrom, text) {
    const message = {
      user_from: userFrom,
      text: text,
    };
    
    try {
      let response = await store.upsert(TABLE, message);
      response = await get(response.insertId);
      return response;
    } catch (err) {
      console.error(err)
      throw error("Internal Server Error", 500);
    }
  }

  return {
    list,
    get,
    upsert,
  };
};
