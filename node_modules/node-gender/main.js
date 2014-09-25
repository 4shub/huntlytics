var genders = require('./lib/genders');

var genderGuesser = {
  find: function(name) {
    return genders[name.toUpperCase()] || 'male';
  }
};

module.exports = genderGuesser;