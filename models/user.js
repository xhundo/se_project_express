const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validator: {
      validator(v) {
        return validator.isEmail(v);
      },
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 9,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Elise Bouer',
  },
  avatar: {
    type: String,
    validator: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'You must enter a valid URL',
    },
    default:
      'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Elise.png',
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('This email already exists'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Invalid email or password'));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
