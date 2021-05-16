const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    if (req.cookies.user)
        res.render("index");
    else
        res.render("landing");
});

router.get("/landing", (req, res) => {
    res.render("landing");
});

module.exports = router;