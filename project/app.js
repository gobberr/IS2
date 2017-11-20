var express = require("express");
var app = express();
var path = require('path');
var route = require('./routes/route');
app.set('public', path.join(__dirname, 'public'));
app.use('/', route);

app.get('*', function(req, res){
    res.send('404');
  });
app.listen(3000);

module.exports = app;