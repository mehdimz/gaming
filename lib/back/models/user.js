var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  gender: Number,
  age: Number,
  tel: Number,
  admin: Boolean
});

// generating a hash
UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);