var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*var GoogleMapsAPI = require('googlemaps');

var publicConfig = {
  key: 'AIzaSyAyPuNc-IQgslbVyEdvq8kCrJvOQSS4Prs',
  stagger_time:       1000, // for elevationPath
  encode_polylines:   false,
  secure:             true, // use https
  proxy:              'http://127.0.0.1:4000' // optional, set a proxy for HTTP requests
};

var gmAPI = new GoogleMapsAPI(publicConfig);*/

// create a schema
// offerta ripetizioni
var postSchema = new Schema({
  text: { type: String, required: true },
  email: { type: String, required: true }, // per fare riferimento all'utente che ha creato il post
  subject: { type: String, required: true },
  location: {
    description: String,
    latitude: String,
    longitude: String,
  },
});

//funzione che trova un annuncio data la MATERIA
postSchema.statics.findPosts = function (subject, lng, lat, callback) {
	
	/*geocoder.geocode(location, function ( err, data ) {
  			if (err) {
				console.log(err);
			} else {
				var long = toString(data[0].geometry.location.lng());
				var latit = toString(data[0].geometry.location.lat());
				console.log(long + ", " + latit);
			}
	});*/
	
	/*var geocodeParams = {
  			"address":    "121, Curtain Road, EC2A 3AD, London UK",
  			"components": "components=country:GB",
  			"bounds":     "55,-1|54,1",
  			"language":   "en",
  			"region":     "uk"
	};

	gmAPI.geocode(geocodeParams, function(err, result){
		if (err) console.log(err);
  		else console.log("GEOCODING: " + result);
	});*/
	if(subject==""){
		Post.find({/*,
					location : {
						longitude : long,
						latitude : latit
					}*/}).exec(function (err, post) {
				if (err) {
			//console.log("debug1");
					return callback(err)
				} else if (!post) {
			console.log("\nnon trovato, " + post);
					return callback(null);
				}
			else {
				//console.log("post: " + post);
				return callback(null, post);
			}
		});
	}
	else{
		Post.find({subject: subject/*,
					location : {
						longitude : long,
						latitude : latit
					}*/}).exec(function (err, post) {
				if (err) {
			//console.log("debug1");
					return callback(err)
				} else if (!post) {
			console.log("\nnon trovato, " + post);
					return callback(null);
				}
			else {
				//console.log("post: " + post);
				return callback(null, post);
			}
		});
	}
}

var Post = mongoose.model('Post', postSchema);

// make this available to our users in our Node applications
module.exports = Post;