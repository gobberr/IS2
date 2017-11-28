var express = require('express');
var router = express.Router();
const pug = require('pug');
var test = require("./test");
var User = require("../model/user");

router.get("/", function(req,res,next){
    isLoggedIn(req,res, function(logged) {
        console.log("logged"+logged);
        res.write(pug.renderFile("views/index.pug", {logged: logged}));
    });
});

router.get("/cerco", function(req,res){res.write(pug.renderFile("views/cerco.pug"));});

router.get("/login", function(req,res){res.write(pug.renderFile("views/login.pug", {error: req.query.error}));});

router.get("/registrati", function(req,res){res.write(pug.renderFile("views/registration.pug"));});

router.get("/offro", function(req,res){res.write(pug.renderFile("views/offro.pug"));});

router.get("/annuncio", function(req,res){res.write(pug.renderFile("views/annuncio.pug"));});

router.use("/test", test);

function isLoggedIn(req, res, callback) {
    User.findById(req.session.userId)
    .exec(function (error, user) {
        if (error) {
            return callback(false);
        } 
        else {
            if (user === null) {
                return callback(false);
            }
            else {
                return callback(true);
            }
        }
    });
}

module.exports = router;