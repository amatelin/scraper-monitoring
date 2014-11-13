var express = require('express'),
	profiles = require('./routes/profiles');
 
var app = express();

app.configure(function () {
	app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
	app.use(express.bodyParser());
	app.set('views', './views')
	app.set('view engine', 'jade')
});
 
app.get('/', function(req, res){
	res.render('Index', {title:'Hey', message:'Hey World!'});
});
app.get('/profiles', profiles.findAll);
app.get('/profiles/:id', profiles.findById);
app.get('/count', profiles.count);
 
app.listen(3000);
console.log('Listening on port 3000...');