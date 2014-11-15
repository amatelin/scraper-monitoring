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

exports.render = function(req, res) {
	data = []
	db.collection('profiles', function(err, collection) {
		collection.count(function(err, nbr) {
			console.log("Profiles processed : "+nbr);
			data.push(nbr);
			db.collection('complete_streets', function(err, collection) {
				collection.find({"profiles_processed":1}).count(function(err, nbr) {
					console.log("Nbr streets processed : "+nbr);
					data.push(nbr);
					db.collection('complete_streets', function(err, collection) {
						collection.find({"profiles_processed":0}).count(function(err, nbr) {
							console.log("Nbr streets to process : "+nbr);
							data.push(nbr);
							db.collection('complete_streets', function(err, collection) {
								collection.find({"profiles_processed":-1}).count(function(err, nbr) {
									console.log("Nbr streets with error : "+nbr);
									data.push(nbr);
									var percent = Math.round((data[1]/data[2])*100)			
									res.render('Index', {title:'Scraper Monitor', figures:data, percentage:percent});						
								});
							});
						});
					});
				});
			});
		});
	})			
};

