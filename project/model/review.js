var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var reviewSchema = new Schema({
  reviewer: { type: String, required: true },
  revised: { type: String, required: true },
  vote: { type: Number, required: true },
});

// the schema is useless so far
// we need to create a model using it
var Review = mongoose.model('Review', reviewSchema);

// non assicuro il funzionamento delle seguenti funzioni per ricavare il voto
// medio di un utente

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
}

// make this available to our users in our Node applications
module.exports = Review;
module.exports = avg;