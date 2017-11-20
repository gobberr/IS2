var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var messageSchema = new Schema({
  text: { type: String, required: true },
  sender: { type: String, required: true },
  reciver: { type: String, required: true },
});

// the schema is useless so far
// we need to create a model using it
var Message = mongoose.model('Message', messageSchema);

// make this available to our users in our Node applications
module.exports = Message;