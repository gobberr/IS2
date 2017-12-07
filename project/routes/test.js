var express = require('express');
//var mongoose = require('mongoose');
var router = express.Router();
const pug = require('pug');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var bcrypt = require("bcrypt")
mongoose.connect('mongodb://dbprogetto:progettois2@ds145293.mlab.com:45293/provadb',{useMongoClient: true});

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var User = require("../model/user");
var Corso = require("../model/post");


//router.get("/", function(req,res){res.send("test");});

router.post("/registrazione", function(req,res,next){
    /*var user = new User();
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
        res.send("Email non valida");*/

    if (req.body.password !== req.body.confpassword) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }
    
    if (req.body.email && req.body.nome && req.body.cognome && req.body.password && req.body.confpassword) {
        var domain;
        var userData = {
            email: req.body.email,
            name: req.body.nome,
            surname: req.body.cognome,            
            password: req.body.password,
            passwordConf: req.body.confpassword,
        }
        domain = userData.email.split("@");
        if(domain[1]==="unitn.it"|| domain[1]==="studenti.unitn.it"||domain[1]==="alumni.unitn.it")
        {
            User.create(userData, function (error, user) {
                if (error) {
                    return next(error);
                }
                else {
                    req.session.userId = user._id;
                    console.log("utente creato e sessione avviata");
                    return res.redirect('/test/successfullyRegistered');
                }
            });
        }
        else
            res.send("Email non valida");
    }

});

    

router.post("/login", function(req,res,next){
    var email = req.body.email;
    var password = req.body.password;    
    // find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
    User.authenticate(email, password, function (error, user) {
        if (error || !user) {
            res.redirect('/login?error=true');
        } 
        else {
            req.session.userId = user._id;
			req.session.emailUser = user.email;
            return res.redirect('/');
        }
    });
});

router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } 
            else 
            {
                return res.redirect('/');
            }
        });
    }
});

router.get('/profile', function (req, res, next) {
    User.findById(req.session.userId)
    .exec(function (error, user) {
        if (error) {
            return next(error);
        } 
        else {
            if (user === null) {
                return next(error);
            } 
            else {
                return res.send('<h1>Name: </h1>' + user.nome + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/test/logout">Logout</a>')
            }
        }
    });
});


router.post("/addPost", function(req,res,next){

	var postData = {
        email: req.body.email,
        subject: req.body.subject,
        text: req.body.text         
    }
	Corso.create(postData, function (error, user) {
        if (error) {
            return next(error);
        }
        else {
            console.log("post creato!");
            return res.redirect('/addPost');
        }
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


router.get("/account", function(req,res,next){
    User.findById(req.session.userId)
    .exec(function (error, user) {
        if (error) {
            return next(error);
        } 
        else {
            if (user === null) {
                return next(error);
            } 
            else {
                res.write(pug.renderFile("views/account.pug", {numero_telefono: user.telephone, email: user.email, skills: user.skills, descrizione: user.description, pippo:req.query.error_size, pluto:req.query.error_ext }));
                res.end();
            }
        }
    });
    
});

router.post("/account", function(req,res){
    var form = req.body.formid;
    
    if(form=="form-1")
    {
        //var tel = req.body.telephone;
        
    User.findByIdAndUpdate(req.session.userId, {telephone: req.body.new_telephone}).exec();
    }
    else if(form=="form-2")
    User.findByIdAndUpdate(req.session.userId, {email: req.body.email}).exec();
    
    else if(form=="form-3")
    {
    
            User.findById(req.session.userId).exec(function(error,user){
                if(error)
                    console.log();
                else{
                    bcrypt.compare(req.body.old_password, user.password, function(err,response){
                        if(response==true)
                            if(req.body.new_password1==req.body.new_password2){
                                user.password=req.body.new_password1;
                                user.save();
                            }

                    });
                }
            });
        
    
    }
    else if(form=="form-4")
    User.findByIdAndUpdate(req.session.userId, {description: req.body.descrizione}).exec();
    
    
    else if(form=="form-5")
    User.findByIdAndUpdate(req.session.userId, {$push: {skills: req.body.competenza}}).exec();
    
    else if(form=="form-6")
    User.findByIdAndUpdate(req.session.userId, {$pull: {skills: req.body.delskill}}).exec();
    
    User.findById(req.session.userId)
    .exec(function (error, user) {
        if (error) {
           // return next(error);
        } 
        else {
            if (user === null) {
                //return next(error);
            } 
            else {
                res.write(pug.renderFile("views/account.pug", {numero_telefono: user.telephone, email: user.email, skills: user.skills, descrizione: user.description }));
                res.end();
            }
        }
    });    
    }
    
);

/*router.post("/cerca", function(req,res,next){
	var subject = req.body.subject;
	//var location = req.body.location;
	
	Corso.find(subject, function (error, post) {
        if (error || !subject) {
            //non ci sono post con questa materia nella zona selezionata
			//visualizza i più vicini in altre zone, con la stessa materia (?)
        } 
        else {
			console.log("query success, " + subject);
			//da inserire parametro per stampare "ricerca senza risultati"
            return res.redirect('/cerco');
        }
    });
});*/


module.exports = router;
console.log("server avviato");