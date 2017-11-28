var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
postSchema.statics.findPosts = function (subject, callback) {
	Post.find({subject: subject}).exec(function (err, post) {
      if (err) {
		//console.log("debug1");
        return callback(err)
      } else if (!post) {
		//console.log("debug2 " + post);
        return callback(null);
      }
		else {
			//console.log("post: " + post);
			return callback(null, post);
		}
	});
}

var Post = mongoose.model('Post', postSchema);

// make this available to our users in our Node applications
module.exports = Post;