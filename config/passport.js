const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, user.id);
  });
});

passport.deserializeUser((id, cb) => {
  process.nextTick(() => {
    User.findOne({id}, (err, users) => {
      cb(err, users);
    });
  });
});

passport.use(new LocalStrategy({usernameField: 'username', passwordField: 'password'}, (_username, _password, cb) => {
  User.findOne({username: _username, deleted: false}, (err, user) => {
    if(err) {
      return cb(err);
    }
    if(!user) {
      return cb(null, false, { error: true, message: 'Username not found'});
    }
    bcrypt.compare(_password, user.password, (err, res) => {
      if(err) {
        return cb(null, false, { error: true, message: err });
      }
      if(!res) {
        return cb(null, false, { error: true, message: 'Invalid Password' });
      }

      let userDetails = {
        role: user.role,
        username: user.username,
        id: user.id
      };
      return cb(null, userDetails, { error: false, message: 'Login Succesful'});
    });
  });
}));
