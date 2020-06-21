var express = require('express');
var router = express.Router();
var debug = require('debug')('http');


router.get('/', function(req, res, next) {

    res.sendFile("public/main.html", {root: __dirname + "/../"});

});

module.exports = router;
