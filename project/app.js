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
app.use(express.static(path.join(__dirname, 'public/upload')));


app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));

app.use('/', route);
app.get('/', function(req,res){
});
app.get('*', function(req, res){
    res.sendFile("404.html", { root : "public"})
});

app.listen(3000, () => {
    console.log('Listening on port 3000!');
})
module.exports = app;