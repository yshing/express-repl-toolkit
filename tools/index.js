'use strict';
module.exports = function (repl, app){
  var commandList = {};
  var captureReq;
  var appStack = app._router.stack || app.stack || undefined;
  
  var traceMiddleware = require('./trace-middleware');

  // exit command.
  attachCommand('exit', process.exit, 'Exit and terminate current process');

  // catchReq command
  attachCommand('catchReq', function() {
    if (captureReq === undefined){
      app.use(cmdCaputreReq);
      if (appStack[appStack.length - 1].handle === cmdCaputreReq){
        var temp = appStack.pop();
        appStack.unshift(temp);
      }
    }
    captureReq = !captureReq;
    return captureReq ? 'On' : 'Off';
    function cmdCaputreReq(req, res, next){
      if (captureReq) {
        repl.context.req = req;
        captureReq = false;
        console.log('Request captured. Try access it by `req`');
      } 
      next();
    }
  }, 'Capture the reference of next request object and make it accessible as `req`');

  // appStack as command.
  attachCommand('appStack', function cmdAppStack(){
    return appStack;
  }, 'The middleware stack of current app instance');

  // help command
  attachCommand('help', function cmdHelp() {
    var commands = Object.keys(commandList);
    var maxLength = Math.max.apply(Math, commands.map(function(i){return i.length; }));
    // Roll out command and helps.
    console.log(
      'Commands:\n' + 
      commands
        .map(function (c) { return padRight(c, maxLength + 2) + '- ' + commandList[c].helpString || ''; })
        .join('\n'));
  }, 'Show available commands');

  // trace middleware.
  attachCommand('tm', function cmdHelp() {
    return traceMiddleware(app);
  }, 'Trace middleware');

  // Helper functions
  function attachCommand(key, func, helpString){
    commandList[key] = {
      func: func,
      helpString: helpString
    };
    Object.defineProperty(repl.context, key, {
      enumerable: false,
      configurable: false,
      get: func,
    });
  }
  function padRight(str, length, char){
    while (str.length < length){
      str += char || ' ';
    }
    return str;
  }
};