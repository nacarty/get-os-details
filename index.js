var exServer = require('express')(); //import express and immediately create a server object
var httpServer = require('http').createServer(exServer); //import http and immediately create a server object
 /*Above:
 Wrap the express server in an http server. Purely voluntary.
 I could also use http.Server() instead of http.createServer().
 Even if you wrap the express server in the http server, you may still directly reference the express server.
 */

var ip = require('ip');  //import ip for use on server side
var getIp = require('ipware')().get_ip; //for use on client side
var LOCAL = require('os-locale');  //import os-locale for server side language detection
var OS = require('os');  //import os

httpServer.listen(process.env.PORT||5500); //or exServer.listen(process.env.PORT||5500);
exServer.set('view engine', 'ejs' ); //ejs was installed with npm --global --save ejs

var myObj = {};
myObj.server ={};
myObj.client ={};

myObj.server.ip = ip.address();

myObj.server.os = {type:OS.type() /*or process.env.OS*/, 
            architecture:OS.arch()/*process.config.variables.host_arch*/, 
	    platform:OS.platform()};
			
myObj.server.processor = { architecture:process.env.PROCESSOR_ARCHITECTURE,
                    identifier:process.env.PROCESSOR_IDENTIFIER,
                    level:process.env.PROCESSOR_LEVEL,
                    revision:process.env.PROCESSOR_REVISION};
                
myObj.server.language = LOCAL.sync();


exServer.get('/',function(req, res){
    
        myObj.client.ip = function(){
            var ipObj = getIp(req);
            
            if (ipObj.clientIpRoutable)
                return ipObj.clientIp;
            else
                return 'Not visible to Server';
        }();  
        
        myObj.client.languages = function(){
            var langStr = req.headers['accept-language'];
                 console.log(req.headers);
                langStr = 'en-US, en-GB, en;q=0.991, fr-CH, fr-NOR;q=0.9, es-Mx;q=0.6, it;q=0.95, *;q=0.20';   
            var regex1 = /;q=\d+\.\d+,*\s*/;  //spit on ";q=0.8,  " etc
            var langArr = langStr.split(regex1);
                langArr.pop();  //remove the last element of the array because it's blank

            var regex2 = /[A-Za-z\s,\*-]*;q=/;  //like ';q='
            var probArr = langStr.split(regex2); 
                delete probArr[0]; //remove the first element of the array because it's blank
            
            var combinedArr = [];
            langArr.forEach(function(cur, indx){
                combinedArr.push([cur, probArr[indx+1]]);     
            });
            
            console.log('Combined Array: '+combinedArr);
            combinedArr.sort(function(a,b){
                if (a[1]>b[1])
                    return -1;
                else
                    return 1;
            });
            console.log('Combined Array: '+combinedArr);
            
            return combinedArr[0][0].split(/[;,]/)[0];
        }();
                
        myObj.client.software = req.headers['user-agent'];      
        //console.log(myObj);
	res.render('tabular_results', myObj); //the fields of myObj are exposed to tabular_results.ejs
});

  