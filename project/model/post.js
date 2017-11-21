var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
// offerta rietizioni
var postSchema = new Schema({
  text: { type: String, required: true },
  email: { type: String, required: true }, // per fare riferimento all'utente che ha creato il post
  subject: { type: String, required: true },
});

// the schema is useless so far
// we need to create a model using it
var Post = mongoose.model('Message', postSchema);

// make this available to our users in our Node applications
module.exports = Post;