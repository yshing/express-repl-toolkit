# express-repl-toolkit
Handy tools to play with express 4+ based apps in repl.
Should also work with things like loopback :)

## Useage:
```js
var app = express(); // Should work also with express-based framewroks like loopback.
var replServer = require('express-repl-toolkit')(app);
```
Then when you run ```node <YOUR_SERVER_SCRIPT>``` you'll got a express.js attached to the repl as app :).
Then explore the app instance in your terminal .

Or you can wrap it with something like this:

```js
var replFlag = process.argv.filter(function(arg) {
  return /^--repl$/i.test(arg);
}).length;
if (replFlag){
	var replServer = require('express-repl-toolkit')(app);
}

```

## Tools:
Type ```help``` in repl to list available commands,

Currently available commands:

tm - Trace middleware mounted in the system.

catchReq - Capture next request as reference, then you can explore it in repl console.

Work in progress. Welcome for new suggestions.

## Try:
```npm start``` or ```node example --repl```
