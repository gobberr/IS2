var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var reviewSchema = new Schema({
  reviewer: { type: String, required: true },
	revised: { type: String, required: true },
	userName: String,
  vote: { type: Number, required: true },
  text: String,
});

//tutte le recensioni su un utente
reviewSchema.statics.findReviewOf = function (id, callback) {
	Review.find({revised : id}).exec(function (err, rev) {
      if (err) {
		//console.log("\nerrore");
		return callback(err);
      } else if (!rev) {
		console.log("\nnon trovata, " + rev);
		return callback(null);
      } else {
		//console.log("\nrev: " + rev);
		return callback(null, rev);
	  }
	});
}

reviewSchema.statics.avg = function(id, callback){
	Review.find({revised : id}, 'vote').exec(function (err, votes) {
      if (err) {
		//console.log("\nerrore");
		return callback(err);
      } else if (!votes) {
		console.log("\nnon trovati, " + votes);
		return callback(null);
      } else {
		//console.log("\nvoti: " + votes);
		return callback(null, votes);
	  }
	});
}

var Review = mongoose.model('Review', reviewSchema);
module.exports = Review;