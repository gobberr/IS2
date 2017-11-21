var express = require("express");
var app = express();
var path = require('path');
var route = require('./routes/route');
var mongoose = require('mongoose');
var assert = require('assert');

mongoose.connect('mongodb://dbprogetto:progettois2@ds145293.mlab.com:45293/provadb',{useMongoClient: true});
app.use(express.static(path.join(__dirname, 'public/style')));
app.use(express.static(path.join(__dirname, 'public/img')));
var User = require("./model/user.js");

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