var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
// offerta rietizioni
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

// the schema is useless so far
// we need to create a model using it
var Post = mongoose.model('Message', postSchema);

//funzione che trova un annuncio
postSchema.statics.find = function (subject, location, /*long, latit*/callback) {
	Post.find({ subject: subject, 
			   location: 
			   {
				   //così trova la città con lo stesso nome
				   description : location
				   
				   //da cambiare con range di coordinate
				   //latitude : parseFloat(long.replace(",", ".")), 
				   //longitude : parseFloat(latit.replace(",", "."))
			  	}
			  })
	.exec(function (err, post) {
      if (err) {
        return callback(err)
      } else if (!post) {
        err.status = 401;
        return callback(err);
      }
	});
}

// make this available to our users in our Node applications
module.exports = Post;