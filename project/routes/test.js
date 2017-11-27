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
        res.redirect('/test/successfullyRegistered');
    }
    else
    res.send("Email non valida");
});
    

router.post("/login", function(req,res){
    var email = req.body.email;
    var password = req.body.password;    
    // find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
    User.findOne({email: email, password: password}, function (err, user) {
      if (err) return err;
        //console.log(user.email); // Space Ghost is a talk show host.
        if(user != null) res.redirect('/test/successfullyRegistered');        
        else res.redirect('/');
    });
});

router.get("/successfullyRegistered", function(req,res){
    var text="Registrazione avvenuta con successo."
    res.write(pug.renderFile("views/success.pug", {
        text: text
    }));
});

/*function registra(req,res)
{
    
    return;
}*/
module.exports = router;
console.log("server avviato");