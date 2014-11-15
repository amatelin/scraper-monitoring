var express = require('express'),
	profiles = require('./routes/profiles');
	index = require('./routes/index');
 
var app = express();

app.configure(function () {
	app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
	app.use(express.bodyParser());
	app.set('views', './views');
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + "/public"));
});
 
app.get('/', function(req, res){
	res.send("Allo");
});
app.get('/profiles', profiles.findAll);
app.get('/profiles/:id', profiles.findById);
app.get('/count', profiles.count);
app.get('/index', index.render);
 
app.listen(3000);
console.log('Listening on port 3000...');