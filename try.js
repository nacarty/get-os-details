var exServer = require('express')(); //import express and immediately create a server object
var httpServer = require('http').createServer(exServer); //import http and immediately create a server object
 /*Above:
 Wrap the express server in an http server. Purely voluntary.
 I could also use http.Server() instead of http.createServer().
 Even if you wrap the express server in the http server, you may still directly reference the express server.
 */

httpServer.listen(process.env.PORT||5500); //or exServer.listen(process.env.PORT||5500);


exServer.set('view engine', 'ejs' ); //ejs was installed with npm --global --save ejs

var myObj = {};
var ip = require('ip');  //import ip 
myObj.ip = ip.address();

var OS = require('os');  //import os
myObj.os = {type:OS.type() /*or process.env.OS*/, 
            architecture:OS.arch()/*process.config.variables.host_arch*/, 
			platform:OS.platform()};
			
myObj.computerName = process.env.COMPUTERNAME;  //process object exists naturally
myObj.user = process.env.USERNAME;
myObj.processor = {quantity: process.env.NUMBER_OF_PROCESSORS,
                   architecture:process.env.PROCESSOR_ARCHITECTURE,
				   identifier:process.env.PROCESSOR_IDENTIFIER,
				   level:process.env.PROCESSOR_LEVEL,
				   revision:process.env.PROCESSOR_REVISION};
				   
var LOCAL = require('os-locale');  //import os-locale. Will this give problems on the server??
myObj.language = LOCAL.sync();

exServer.get('/', function(req, res){
	res.render('tabular_results', myObj); //the fields of myObj are exposed to tabular_results.ejs
});

  