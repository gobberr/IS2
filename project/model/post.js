var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
// offerta ripetizioni
var postSchema = new Schema({
  text: { type: String, required: true },
  userId: { type: String, required: true }, // per fare riferimento all'utente che ha creato il post
  subject: { type: String, required: true },
  userName: String,
  location: {
    description: String,
    latitude: String,
    longitude: String,
  },
  deleted: Boolean,
});

//funzione che trova un annuncio in base alla materia, se specificata
postSchema.statics.findPosts = function (subject, callback) {
	if(subject=="") {
		Post.find({}).exec(function (err, post) {
			if (err) {
				//console.log("debug1");
				return callback(err)
			} else if (!post) {
				console.log("\nnon trovato, " + post);
				return callback(null);
			} else {
				//console.log("post: " + post);
				return callback(null, post);
			}
		});
	} else {
		Post.find({subject: subject})
			.exec(function (err, post) {
				if (err) {
					//console.log("debug1");
					return callback(err)
				} else if (!post) {
					console.log("\nnon trovato, " + post);
					return callback(null);
				} else {
					//console.log("post: " + post);
					return callback(null, post);
				}
			});
	}
}

//funzione che trova tutti gli annunci di un utente
postSchema.statics.findUserPosts = function (user, callback) {
	Post.find({userId : user}).exec(function (err, post) {
		if (err) {
			return callback(err);
		} else if (!post) {
			return callback(null);
		} else {
			return callback(null, post);
		}
	});
}


var Post = mongoose.model('Post', postSchema);

// make this available to our users in our Node applications
module.exports = Post;