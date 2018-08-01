#!/usr/bin/env node

let express = require('express');
let logger = require('morgan');
let app = express();
app.use(logger('dev'));
app.use(express.static(__dirname));

// catch 404 and forward to error handler
app.use(function(req, res, next){
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next){
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error =  err ;

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});


// listen on provided port, on all network interfaces.
let http = require('http');
let port = process.env.PORT || '3002';
app.set('port', port);
let server = http.createServer(app);
server.listen(port);
server.on('error', (e)=>{throw e;});
server.on('listening', ()=>{console.log("listening on port ", server.address().port);});

console.log("page that contains links to all examples: http://localhost:" + server.address().port + "/Examples.html");
console.log("hello world static example: http://localhost:" + server.address().port + "/hello-world-static/index.html");
console.log("hello world dynamic example: http://localhost:" + server.address().port + "/hello-world-dynamic/index.html");
console.log("js framework benchmark example: http://localhost:" + server.address().port + "/js-framework-benchmark/index.html");
console.log("schedule example: http://localhost:" + server.address().port + "/schedule/index.html");
console.log("grid example: http://localhost:" + server.address().port + "/grid/index.html");
console.log("state button example: http://localhost:" + server.address().port + "/state-button/index.html");
console.log("thinking-in-backdraft (Step 2) example: http://localhost:" + server.address().port + "/thinking-in-backdraft/index-step-2.html");
console.log("thinking-in-backdraft (Step 3) example: http://localhost:" + server.address().port + "/thinking-in-backdraft/index-step-3.html");
console.log("thinking-in-backdraft (Step 4) example: http://localhost:" + server.address().port + "/thinking-in-backdraft/index-step-5.html");
console.log("todo mvc example: http://localhost:" + server.address().port + "/todomvc/index.html");
