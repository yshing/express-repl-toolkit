/*
 This example contains really bad cases when using express..
 */
'use strict';
var express = require('express');
var app = express();
var replSetup = require('../index.js');

var port = process.env.PORT || 1337;

app.listen(port, function (){
  var replServer = replSetup(app);
  replServer.context.help;
});

// hello world route
app.get('/hello', function (req, res, next){
  res.send('hello world');
});

// something bad here. 
app.use(function BadGuy (req, res, next){ next(); });


// route never reached unless bad guys are killed.
app.get('/', function (req, res, next){
  res.send('you should never reach me');
});

var r = express.Router();

r.get('/haha',function (req, res){ res.end('haha');});

app.use('/nested', r);