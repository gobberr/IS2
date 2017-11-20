var express = require("express");
var app = express();
var path = require('path');
var route = require('./routes/route');
app.use(express.static(path.join(__dirname, 'public/style')));
app.use(express.static(path.join(__dirname, 'public/img')));

app.use('/', route);
app.get('*', function(req, res){
    res.sendFile("404.html", { root : "public"})
  });
app.listen(3000);

module.exports = app;