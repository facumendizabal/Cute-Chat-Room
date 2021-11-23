const auth = require("../auth");

module.exports = function checkAuth(action) {
  function middleware(req, res, next) {
    switch (action) {
      case "update":
        const owner = req.body.id;
        auth.check.logged(req);
        //auth.check.own(req, owner);
        next();
        break;
      case "logged":
        try {
          auth.check.logged(req);
        } catch (err) {
          if (req.accepts('html')) {
            res.redirect("http://127.0.0.1:3000/auth/login");
          }
        }
        next();
        break;
      default:
        next();
    }
  }

  return middleware;
};
