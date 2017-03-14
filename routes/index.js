var path = require('path');
var express = require('express');
var twilio = require('twilio');
var config = require('../config.js');
var http = require('http');
var AccessToken = require('twilio').AccessToken;
var bodyParser = require('body-parser');




var twiliAccntInfoFromFile=config.getTwiliAccountSettingsfromFile ;


if (twiliAccntInfoFromFile !="Y" )
   {
     console.log("Loading Configuration from environment");
     // Load configuration information from system environment variables
     var TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
         TWILIO_IPM_SERVICE_SID = process.env.TWILIO_IPM_SERVICE_SID ,
         TWILIO_IPM_API_KEY = process.env.TWILIO_IPM_API_KEY,
         TWILIO_IPM_API_SECRET = process.env.TWILIO_IPM_API_SECRET;
   }
else
   {
     console.log("Loading Configuration from config.js");
     // Load configuration information config file
     var TWILIO_ACCOUNT_SID = config.accountSid;
         TWILIO_IPM_SERVICE_SID = config.serviceSid ,
         TWILIO_IPM_API_KEY = config.apiKey,
         TWILIO_IPM_API_SECRET =  config.apiSecret;
   }

// Configure appplication routes
module.exports = function(app) {

    // Mount Express middleware for serving static content from the "public"
    // directory
    app.use(express.static(path.join(process.cwd(), 'public')));
    app.use(express.static(path.join(process.cwd(), 'assets')));
    app.use(bodyParser()); 
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    // In production, validate that inbound requests have in fact originated
    // from Twilio. In our node.js helper library, we provide Express middleware
    // for this purpose. This validation will only be performed in production
    if (config.nodeEnv === 'production') {
        // For all webhook routes prefixed by "/twilio", apply validation
        // middleware
        app.use('/twilio/*', twilio.webhook(config.authToken, {
            host: config.host,
            protocol: 'https' // Assumes you're being safe and using SSL
        }));
    }



/*
 Dummy GET endpoint - ep1?var1=Hello&var2=World
*/
app.get('/ep1', function(i_Req, o_Res) 
{
    var var1 = i_Req.query.var1;
    var var2 = i_Req.query.var2;

    console.log ( i_Req.query);
    response=var1 + ":" + var2 ;
    console.log(response);

    //o_Res.set('Content-Type','text/xml');
    //o_Res.send(response.toString());
    o_Res.send(response);

});



/*
 Dummy POST endpoint -ep1?var1=Hello&var2=World
 payload : application/json
         {
	     "var3" : "head",
	     "var4" : "leg"
          }

 Response : Hello:World:head:leg
*/
app.post('/ep1', function(i_Req, o_Res) 
{
    var var1 = i_Req.query.var1;
    var var2 = i_Req.query.var2;
    var var3 = i_Req.body.var3;
    var var4 = i_Req.body.var4;

    console.log ( i_Req.query);
    console.log ( i_Req.body);
    response=var1 + ":" + var2 + ":" + var3 + ":" + var4;

    o_Res.set('Content-Type','text/xml');
    o_Res.send(response.toString());

});
	
app.get("/echo" , function(req,res)
{
 var text = "I will echo whatever I get :: " + JSON.stringify(req.query) ;
 console.log(text);
 res.send(text);
});


app.post("/echo" , function(req,res)
{
 var text = "I will echo whatever I get :: " + JSON.stringify(req.body) ;
 console.log(req);
 console.log(req.body);
 res.send(text);
});	

app.get("/" , function(req,res)
 {
    res.sendFile(__dirname+"/index.html");
 }
);

};
