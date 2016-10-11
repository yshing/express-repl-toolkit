var httpMocks = require('node-mocks-http');
function traceRoute(app) {
  return function trCmd(path, option){
    var method = 'GET';
    var mockReq;
    var mockRes;
    var sPath;
    if (path.split(' ').length === 2){
      method = path.split(' ')[0].toUpperCase();
      path = path.split(' ')[1];
    }
    mockReq = httpMocks.createRequest({
      method: method,
      url: path
    });
    mockRes = httpMocks.createResponse();
    mockRes._oEnd = mockRes.end;

    mockRes.end = mockRes.send = mockRes.write = function traceRouteResEnd(data){
      Error.stackTraceLimit = Infinity;
      var errStack = new Error().stack;
      Error.stackTraceLimit = 10;
      var errStackArray = errStack.split('\n').slice(2);
      errStackArray = errStackArray.slice(0,errStackArray.indexOf(errStackArray.find(function (str){
        return /^    at trCmd/.test(str);
      })));
      var result = errStackArray.map(function (item, index){
        var row = item.trim().replace(/[\(|\)]/g,'').match(/at (.*?)\/(.*?)$/);
        if (!row) return undefined;
        if (row[1] === '') row[1] = '<anonymous function>';
        if (/express.lib.router|express.lib.application/.test(row[2])) return undefined;
        return 'handler:' + row[1].trim() + '    at /' + row[2];
      }).filter(Boolean);
      console.log(result);
    };
    try{
      app(mockReq, mockRes);
    } catch (e){
      console.log(e.message);
    }
  };
}
module.exports = traceRoute;