var express = require('express');
var router = express.Router();


router.get("/", function(req,res){ res.sendFile("index.html", {root: "public"})});

router.get("/cerca", function(req,res){res.sendFile("cerco_ripetizioni.html",{ root : "public"})});

router.get("/login", function(req,res){res.sendFile("login.html",{ root : "public"})});

router.get("/registrati", function(req,res){res.sendFile("registrati.html",{ root : "public"})});

router.get("/offri", function(req,res){res.sendFile("offro_ripetizioni.html",{ root : "public"})});


module.exports = router;