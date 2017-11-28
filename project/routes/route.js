var express = require('express');
var router = express.Router();
const pug = require('pug');
var test = require("./test");
var User = require("../model/user");
var Corso = require("../model/post");

router.get("/", function(req,res,next){
    isLoggedIn(req,res, function(logged) {
        console.log("logged"+logged);
        res.write(pug.renderFile("views/index.pug", {logged: logged}));
    });
});

//quando carica la prima volta la pagina di ricerca, non ci sono parametri
router.get("/cerco", function(req,res){
	res.write(pug.renderFile("views/cerco.pug", {values: []}));
});

//quando riceve una richiesta e ricarica la pagina con i risultati
router.post("/cerco", function(req,res){
	var subject = req.body.subject;
	//DA AGGIUNGERE geolocalizzazione, trasforma la location indicata nella form in longitudine e latitudine
	//var location = req.body.location;
	
	Corso.findPosts(subject, function (error, post) {
        if (error || post.length===0) {
            //non ci sono post con questa materia
            //DA AGGIUNGERE "nessun risultato per la ricerca"
			console.log("nessun risultato dalla query");
			res.write(pug.renderFile("views/cerco.pug", {values: []}));
        } else {
			console.log("query success: subject=" + subject + ", post=" + post);
			res.write(pug.renderFile("views/cerco.pug", {values: post}));
        }
		//DA AGGIUNGERE se ci sono post con la materia ma non nella zona, visualizza i più vicini
    });
});

router.get("/login", function(req,res){res.write(pug.renderFile("views/login.pug", {error: req.query.error}));});

router.get("/registrati", function(req,res){res.write(pug.renderFile("views/registration.pug"));});

router.get("/offro", function(req,res){res.write(pug.renderFile("views/offro.pug"));});

router.get("/annuncio", function(req,res){res.write(pug.renderFile("views/annuncio.pug"));});

router.get("/addPost", function(req,res){res.write(pug.renderFile("views/addPost.pug"));});

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