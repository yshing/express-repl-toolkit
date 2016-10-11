function catchReqMounter (app, repl) {
  var catchNextReq;
  var appStack = app._router.stack || app.stack || undefined;
  return function catchReqCommand(callback){
    if (typeof catchNextReq === 'undefined') {
      app.use(catchReqMiddleware);
      appStack.unshift(appStack.pop());
    }
    catchNextReq = !catchNextReq;
    return catchNextReq ? 'CatchNextReq On' : 'CatchNextReq Off';
  };
  function catchReqMiddleware (req, res, next){
    if (catchNextReq) repl.context.req = req;
    next();
  }
}
module.exports = catchReqMounter;
