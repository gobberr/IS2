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

// make this available to our users in our Node applications
module.exports = Review;