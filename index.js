'use strict';
module.exports = function setupREPL(app, option){
  option = option || '>';
  var replServerInstance = require('repl').start(option);
  var setupTools = require('./tools');
  // monut app instace reference
  console.log('Application Instance is mounted on `app` type app.<tab> to expore.');
  replServerInstance.context.app = app;
  // mount also models if is loopback
  if (app.loopback){
    replServerInstance.context.m = app.models;
    console.log('Loopback models is mounted on `m` type m.<tab> to expore available models');
  }
  setupTools(replServerInstance, app);
  return replServerInstance;
};