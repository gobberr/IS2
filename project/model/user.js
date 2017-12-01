var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telephone: Number,
  description: String,
  skills: [String],
  cdl: String,
  dob: { type: Date, /*required: true*/ },
  created_at: Date,
  updated_at: Date
});

userSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

//hashing a password before saving it to the database
userSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    console.log(user.password);
    next();
  })
});

//funzione per trovare un utente corrispondente ai parametri passati
userSchema.statics.findByEmail = function (email, callback) {
	User.findOne({ email : email }).exec(function (err, user) {
      if (err) {
		console.log("\nerrore");
        return callback(err);
      } else if (!user) {
		console.log("\nnon trovato, " + user);
        return callback(null);
	  } else {
	  	console.log("\nuser: " + user);
		//console.log("\n\n" + user.email + "\n");
		return callback(null, user);
	  }
	});
}

var User = mongoose.model('User', userSchema);

module.exports = User;