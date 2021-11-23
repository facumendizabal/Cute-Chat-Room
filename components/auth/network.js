const express = require("express");

const router = express.Router();
const response = require("../../network/response");
const controller = require("./index");

router.post("/login", async (req, res, next) => {
  try {
    const token = await controller.login(req.body.username, req.body.password);
    
    let cookieOptions = {
      maxAge: 1000 * 60 * 60 * 1, // 1h
      httpOnly: true, 
      signed: true,
    };
    res.cookie("chatroom_authtoken", token, cookieOptions);
    
    response.success(req, res, token, 200);
  } catch (err) {
    next(err);
  }
});

router.get("/logout", async (req, res, next) => {
  try {
    res.clearCookie("chatroom_authtoken");
    
    if (req.accepts('html')) {
      res.redirect("http://127.0.0.1:3000/");
      return;
    }
  } catch (err) { 
    next(err);
  }
});

module.exports = router;
