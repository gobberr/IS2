var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var reviewSchema = new Schema({
  reviewer: { type: String, required: true },
  revised: { type: String, required: true },
  vote: { type: Number, required: true },
  text: String,
});

//tutte le recensioni fatte da un utente
//reviewSchema.statics.findReviewBy = function (subject, callback) {

//tutte le recensioni su un utente
reviewSchema.statics.findReviewOf = function (email, callback) {
	
	Review.find({revised : email}).exec(function (err, rev) {
      if (err) {
		console.log("\nerrore");
		return callback(err);
      } else if (!rev) {
		console.log("\nnon trovato, " + rev);
		return callback(null);
      } else {
		//console.log("\nrev: " + rev);
		return callback(null, rev);
	  }
	});
}
/*
// recupera la lista dei voti da un utente
var get_votes = function(email){
  Review.find({ revised: email }, 'vote', function(err, review) {
    if (err) throw err;
    // object of the user
    console.log(user);
  });
};

// conta il numero di voti
var count=get_votes(email).length;

// somma i voti
var sum=0;
get_votes.forEach(function(element) {
  sum+=parseInt(element);
  console.log(element);
});

// avg restituisce la somma dei  voti
var avg=function(email){
  if(count(email)==0) return 0;
  return sum/count(email);
}*/

// make this available to our users in our Node applications
var Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
//module.exports = avg;