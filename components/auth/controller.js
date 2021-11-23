const bcrypt = require("bcrypt");

const auth = require("../../auth");
const error = require("../../utils/error");

const TABLE = "auth";

module.exports = function (injectedStore) {
  let store = injectedStore;

  async function login(username, password) {
    const dbPassword = await store.query(TABLE, { username: username });

    try {
      const comparedPass = await bcrypt.compare(password, dbPassword.password);
  
      //generate token
      const user = await store.query("user", {username: username})       
      return await auth.sign(user);
    } catch {
      throw error("Invalid information", 401);
    }
    
  }

  async function upsert(data) {
    try {

      const authData = {
        id: data.id,
      };
      
      if (data.username) {
        authData.username = data.username;
      }
      
      if (data.password) {
        authData.password = await bcrypt.hash(data.password, 5);
      }
      
      return await store.upsert(TABLE, authData);
    } catch {
      throw error("Internal Server Error", 500);
    } 
  }

  return {
    upsert,
    login,
  };
};
