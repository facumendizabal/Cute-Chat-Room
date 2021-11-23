require('dotenv').config();
let a = {};

module.exports = {
    app: {
        port: process.env.PORT || 3000,
        host: process.env.APP_HOST || "127.0.0.1",
        dir: `http://${process.env.APP_HOST}:${process.env.PORT}`,
    },
    jwt: {
        secret: process.env.JWT_SECRET || "3df5cb8dc6ea8933ee7dfec6508c4e6a1dd1dc93a7a866a88c103403a1726d0e",
    },
    db: {
        host: process.env.DB_HOST || "",
        user: process.env.DB_USER || "",
        password: process.env.DB_PASSWORD || "",
        name: process.env.DB_NAME || "",
    },
    cookie: {
        secret: process.env.COOKIE_SECRET || "030b2d8f9f3c9f21fafffbbec10582fa27b4d02598ac8760b7e2bf393e38ef42"
    },
};
