var express = require("express");
var app = express();
var path = require('path');
var route = require('./routes/route');
var mongoose = require('mongoose');
var assert = require('assert');
const pug = require('pug');
var bodyParser = require('body-parser');
var session = require('express-session');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

mongoose.connect('mongodb://dbprogetto:progettois2@ds145293.mlab.com:45293/provadb',{useMongoClient: true});
app.use(express.static(path.join(__dirname, 'public/style')));
app.use(express.static(path.join(__dirname, 'public/img')));
var User = require("./model/user.js");

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));

app.use('/', route);
app.get('/', function(req,res){
  //var luca = new User({name:"pippo", surname:"pluto", email:"topolino@disney.it", password:"PastoLestoDarkPovoGang"});
  //luca.save(function(err){if(err)throw err; console.log("luca aggiunto")});
  console.log("debug");
});
app.get('*', function(req, res){
    res.sendFile("404.html", { root : "public"})
  });
app.listen(3000);

module.exports = app;