var express = require('express');
var router = express.Router();
const pug = require('pug');
var test = require("./test");

router.get("/", function(req,res,next){res.write(pug.renderFile("views/index.pug", {logged:true}));});

router.get("/cerco", function(req,res){res.write(pug.renderFile("views/cerco.pug"));});

router.get("/login", function(req,res){res.write(pug.renderFile("views/login.pug"));});

router.get("/registrati", function(req,res){res.write(pug.renderFile("views/registration.pug"));});

router.get("/offro", function(req,res){res.write(pug.renderFile("views/offro.pug"));});

router.get("/annuncio", function(req,res){res.write(pug.renderFile("views/annuncio.pug"));});

router.use("/test", test);

module.exports = router;