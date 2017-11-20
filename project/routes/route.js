var express = require('express');
var router = express.Router();

router.get("/", function(req,res){ res.sendFile("index.html", {root: req.app.get("public")})});

router.get("/cerca", function(req,res){res.sendFile("cerco_ripetizioni.html",{ root : req.app.get("public")})});


module.exports = router;