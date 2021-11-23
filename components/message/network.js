const express = require("express");

const authMiddle = require("../../middlewears/authentication");
const response = require("../../network/response");
const controller = require("./index");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const list = await controller.list(req.query.limit);

    response.success(req, res, list);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const message = await controller.get(req.params.id);
    response.success(req, res, message);
  } catch (err) {
    next(err);
  }
});

router.post("/", authMiddle("logged"), async (req, res, next) => {
  try {
    const message = await controller.upsert(req.username.id, req.body.text);


    response.success(req, res, message, 201);
  } catch (err) {
    next(err);
  }
});

router.put("/", authMiddle("logged"), async (req, res, next) => {
  try {
    const message = await controller.upsert(req.body);
    response.success(req, res, message, 201);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
