const passport = require('passport');

module.exports = {
	login: function(req, res) {
    passport.authenticate('local', function(err, user, info){
      if((err) || (!user)) {
        return res.send({
          error: true,
          message: err || info.message
        });
      }
      req.logIn(user, function(err) {
        if(err) res.send(err);
        return res.send({
          message: info.message,
          user
        });
      });
    })(req, res);
  },

	logout: function(req, res) {
    req.logout();
    res.send({error: false, msg: "Logout successfull"});
  },

  getLoggedUser: function(req, res) {
    if(req.user) {
      User.findOne({id: req.user.id})
        .then(user => {
          delete user.password;
          delete user.createdAt;
          delete user.updatedAt;
          res.send({error: false, data: user});
        })
        .catch(err => {
          return err;
        })
    } else {
      res.send({error: false, msg: "No logged user"});
    }
  },

  isAdmin: function(req, res) {
    if(req.user) {
      User.findOne({id: req.user.id, role: 'ADMIN'})
        .then(user => {
          if(user) {
            res.send({error: false, data: true});
          } else {
            res.send({error: false, data: false});
          }
        })
        .catch(err => {
          res.send({error: false, msg: err});
        })
    }
  },

};
