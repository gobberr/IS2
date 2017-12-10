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



/*
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
*/

module.exports = router;
console.log("server avviato");