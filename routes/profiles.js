var mongo = require('mongodb');
 
var Server = mongo.Server,
Db = mongo.Db,
BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('land_register', server);
 
db.open(function(err, db) {
	if(!err) {
		console.log("Connected to 'land_register' database");
		db.collection('profiles', {strict:true}, function(err, collection) {
			if (err) {
				console.log("The 'profiles' collection doesn't exist. Please run LoyerExpressScraper.py");
			}
		});
	}
});
 
exports.findById = function(req, res) {
	var id = req.params.id;
	console.log('Retrieving profile: ' + id);
	db.collection('profiles', function(err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
			res.send(item);
		});
	});
};
 
exports.findAll = function(req, res) {
	db.collection('profiles', function(err, collection) {
		collection.find().toArray(function(err, items) {
			res.send(items);
		});
	});
};

exports.count = function(req, res) {
	db.collection('profiles', function(err, collection) {
		collection.count(function(err, nbr) {
			console.log("Profiles processed : "+nbr);
			res.send(nbr);
		});
	});

};