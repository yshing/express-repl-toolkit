'use strict';
function mountTools(repl, app){
  var commandList = {};
  var captureReq;
  var appStack = app._router.stack || app.stack || undefined;
  
  var traceMiddleware = require('./trace-middleware');
  var traceRoute = require('./trace-route')(app);
  var catchReq = require('./catch-req')(app, repl);
  var cmdHelp = require('./help-command')(commandList);
  var listRoutes = require('express-list-routes');
  var pathToRegex = require('path-to-regexp');
  // exit command.
  attachCommand('exit', process.exit, 'Exit and terminate current process');

  // catchReq command
  attachCommand('catchReq', catchReq, 'Capture the reference of next request object and make it accessible as `req`');

  // appStack as command.
  repl.context.appStack = appStack;
  attachCommand('appStack', undefined, 'The middleware stack of current app instance');

  // help command
  attachCommand('help', cmdHelp, 'Show available commands');

  // list routes command
  attachCommand('lr', function lr(){
    function traceRouteRecursive(handle, path){
      var subRouters;
      if (Array.isArray(handle.stack)){
        subRouters = handle.stack.filter(i => i.handle.stack);
        subRouters.forEach(function (i){
          traceRouteRecursive(i.handle, path +' > ' + ((i.route && i.route.path) || '' + i.regexp));
        });
      }
      listRoutes(path, handle);
    }
    listRoutes('/',app._router);
    var routers = appStack.filter(function (layer){
      return Boolean(layer.handle.stack);
    }).map(function (stack){
      // console.log(stack.handle.mountPath);
      traceRouteRecursive(stack.handle, ((stack.route && stack.route.path) || '' + stack.regexp));
    });
    // routers.unshift(app._router);
    return listRoutes.apply(this,routers);
    // return listRoutes(app._router);
  }, 'List routes mounted directly mounted current app');

  // traceRoute command
  attachCommand('tr', function tr() {
    return traceRoute;
  }, 'Trace route, tr("[METHOD] [PATH]") tr("GET /hi") or tr("hi"), throws TypeError when not being handled at all.');

  // traceMiddleware command.
  attachCommand('tm', function tm() {
    return traceMiddleware(app);
  }, 'Trace middleware');

  // Helper functions
  function attachCommand(key, func, helpString){
    commandList[key] = {
      func: func,
      helpString: helpString
    };
    if (key && func) Object.defineProperty(repl.context, key, {
      enumerable: false,
      configurable: false,
      get: func,
    });
  }

}
module.exports = mountTools;
