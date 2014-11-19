var mongo = require('mongodb');
var async = require('async');
 
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
	var data = {};
	async.parallel([
		//Get number of profiles processed
		function(callback){
			db.collection('profiles', function(err, collection) {
				collection.count(function(err, res){
					if (err) return callback(err);
					data.nbr_profiles_processed = res;
					callback();
				});
			});
			
		},
		//Get number streets processed
		function(callback){
			db.collection('complete_streets', function(err, collection) {
				collection.find({"profiles_processed":1}).count(function(err, res){
				if (err) return callback(err);
				data.nbr_streets_processed = res;
				callback();
				});
			});

		},
		//Get number streets remaining 
		function(callback){
			db.collection('complete_streets', function(err, collection) {
				collection.find({"profiles_processed":0}).count(function(err, res){
					if (err) return callback(err);
					data.nbr_streets_remaining = res;
					callback();
				});	
			});

		},
		//Get number of errors
		function(callback){
			db.collection('complete_streets', function(err, collection) {
				collection.find({"profiles_processed":-1}).count(function(err, res){
					if (err) return callback(err);
					data.nbr_errors = res;
					callback();
				});
			});
			
		}
	],	 
		//Callback function, executed after all the async calls are done with 
		function(err){
			if (err) return next(err); //Let express handle the error 
			var status;
			if (data.nbr_errors>1000) {
				status=0;
			} else {
				status=1;
			}
			var progress_ratio = Math.round((data.nbr_streets_processed/(data.nbr_streets_remaining+data.nbr_streets_processed+data.nbr_errors))*100);
			res.render('Index', {title:'Scraper Monitor', 
					  			 mongo_data:data, 
					  			 nbr_profiles_processed:data.nbr_profiles_processed, 
					  			 percentage:progress_ratio, 
					  			 status:status});
	});
};
