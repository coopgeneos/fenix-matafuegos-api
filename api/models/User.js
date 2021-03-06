const bcrypt = require('bcrypt-nodejs');

module.exports = {
	attributes: {
    name: {
      type: 'string',
      required: true
    },
    username: {
      type: 'string',
      required: true,
      // unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    role: {
      type: 'string',
      isIn: ['ADMIN', 'OPERARIO'],
    }
  },

  tableName: 'userx',

  customToJSON: function() {
    return _.omit(this, ['password'])
  },

  beforeCreate: function(user, cb){
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(user.password, salt, null, function(err, hash){
        if(err) return cb(err);
        user.password = hash;
        return cb();
      });
    });
  },

  beforeUpdate: function(user, cb){
    if(user.password) {
      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(user.password, salt, null, function(err, hash){
          if(err) return cb(err);
          user.password = hash;
          return cb();
        });
      });
    } else {
      return cb();
    }
  }
};
