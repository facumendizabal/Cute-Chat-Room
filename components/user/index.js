const store = require("../../services/db");
const controller = require("./controller");

module.exports = controller(store);