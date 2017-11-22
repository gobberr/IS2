var express = require('express');
var router = express.Router();
const pug = require('pug');

router.get("/", function(req,res){res.send("test");});

module.exports = router;