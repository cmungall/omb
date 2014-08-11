
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var ontology = require('./routes/ontology');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var repository;

var yaml = require('js-yaml');
var fs   = require('fs');

// Get document, or throw exception on error
var repositoryBase = "data/repository";
try {
    repository = yaml.safeLoad(fs.readFileSync(repositoryBase + '.yaml', 'utf8'));
    fs.writeFile(repositoryBase + ".jsonld", JSON.stringify(repository,null,' '));
    console.log("refereshed repository");
} catch (e) {
    console.error("Error reading repo");
    console.log(e);
}

// Make our repository accessible to our router
app.use(function(req,res,next){
    req.repository = repository;
    next();
});


 
app.get('/', ontology.list);
app.get('/ontologies', ontology.list);
app.get('/ontology/:id', ontology.info);
app.get('/obo/*', ontology.fall_through);

app.get('/*', function(req, res){ res.send("FALL THROUGH")});



/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.error("ERRPR");
        console.error(err.stack);
        //res.render('error', {
        //    message: err.message,
        //    error: err
        //});
        res.send(500);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    //res.render('error', {
    //    message: err.message,
    //    error: {}
    //});
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
