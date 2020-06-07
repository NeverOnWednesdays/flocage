var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");
var debug = require('debug')('http');

/* GET home page. */
router.get('/', function (req, res, next) {
    var uid = "stranger";
    if (req.cookies.UID) {
        uid = req.cookies.UID;
    }
    else {
        uid = randomstring.generate(32);
        res.cookie('UID', uid);
    }
    res.render('index', {
        uid: uid
    });
});

module.exports = router;
