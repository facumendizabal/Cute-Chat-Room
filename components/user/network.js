const express = require("express");

const authMiddle = require("../../middlewears/authentication");
const response = require("../../network/response");
const controller = require("./index");

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const list = await controller.list();
        response.success(req, res, list);
    } catch (err) {
        next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const user = await controller.get(req.params.id);
        response.success(req, res, user);
    } catch (err) {
        next(err);
    }
});


router.post("/", async (req, res, next) => {
    try {
        const user = await controller.upsert(req.body);
        response.success(req, res, user, 201);
    } catch (err) {
        next(err);
    }
});

router.put("/", authMiddle("logged"), async (req, res, next) => {
    try {
        const user = await controller.upsert(req.body);
        response.success(req, res, user, 201);
    } catch (err) {
        next(err);
    }
});


module.exports = router;