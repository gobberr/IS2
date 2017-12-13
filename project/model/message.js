var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var messageSchema = new Schema({
  contact: { type: String, required: true },
  sender: { type: String, required: true },
  reciver: { type: String, required: true },
  post: { type: String, required: true },
  recived: { type: Boolean, required: true },
});

messageSchema.statics.findMessages = function (reciverId, callback) {
	Message.find({reciver: reciverId}).sort('recived')
		.exec(function (err, message) {
			if (err) {
				//console.log("debug1");
				return callback(err)
			} else if (!message) {
				return callback(null);
			} else {
				//console.log("post: " + post);
				return callback(null, message);
			}
  });
}


// the schema is useless so far
// we need to create a model using it
var Message = mongoose.model('Message', messageSchema);

// make this available to our users in our Node applications
module.exports = Message;