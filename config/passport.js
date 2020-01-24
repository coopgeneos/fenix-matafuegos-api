const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      bcrypt = require('bcrypt-nodejs');

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb){
  User.findOne({id}, function(err, users) {
    cb(err, users);
  });
});

passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password'
	}, function(_username, _password, cb){
		User.findOne({username: _username, deleted: false}, function(err, user){
			if(err) return cb(err);
			if(!user) return cb(null, false, { error: true, message: 'Username not found'});
			
			bcrypt.compare(_password, user.password, function(err, res) {
				if(err)
					return cb(null, false, { error: true, message: err });
				if(!res) 
					return cb(null, false, { error: true, message: 'Invalid Password' });
																											 
				let userDetails = {
					role: user.role,
					username: user.username,
					id: user.id
				};
				return cb(null, userDetails, { error: false, message: 'Login Succesful'});
			});
		});
})); 
