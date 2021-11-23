const auth = require("../auth");
const error = require("../../utils/error");

const TABLE = "user";

module.exports = function(injectedStore) {
    let store = injectedStore;

    async function list() {
        return await store.list(TABLE);
    }
    
    async function get(id) {
        return await store.get(TABLE, id);
    }

    async function upsert(body) {
        const user = {
            username: body.username,        
        };
        
        // Check if username is taken
        const data = await store.query(TABLE, { username: body.username });
        if (data.username !== undefined) {
            throw error("Username taken",400); 
        }

        if (body.password && body.username) {
            await auth.upsert({
                username: user.username,
                password: body.password,
            });
        }

        const response = await store.upsert(TABLE, user);
        return {
            id: response.insertId,
        };
    }

    return {
        list,
        get,
        upsert,
    };
}