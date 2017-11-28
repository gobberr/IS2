var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
const pug = require('pug');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
mongoose.connect('mongodb://dbprogetto:progettois2@ds145293.mlab.com:45293/provadb',{useMongoClient: true});

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var User = require("../model/user");


router.get("/", function(req,res){res.send("test");});

router.post("/registrazione", function(req,res){
    var user = new User();
    var domain;
    var email = req.body.email;
    domain = email.split("@");
    if(domain[1]==="unitn.it"|| domain[1]==="studenti.unitn.it"||domain[1]==="alumni.unitn.it")
    {
    console.log(mongoose.connection.readyState);
    user.name = req.body.nome;
    user.surname = req.body.cognome;
    
    user.email=email;
    user.password = req.body.password;
    user.save(function(err){if(err) throw err; else console.log("utente aggiunto");}); 
    res.redirect("/");
    }
    else
    res.send("Email non valida");
});
    

router.post("/login"), function(req,res){
    
}

/*function registra(req,res)
{
    
    return;
}*/
module.exports = router;