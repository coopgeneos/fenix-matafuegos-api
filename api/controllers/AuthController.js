const passport = require('passport');

module.exports = {
  login: (req, res) => {
    passport.authenticate('local', (err, user, info) => {
      if((err) || (!user)) {
        return res.send({
          error: true,
          message: err || info.message
        });
      }
      req.logIn(user, (err) => {
        if(err) {
          res.send(err);
        }
        return res.send({
          message: info.message,
          user
        });
      });
    })(req, res);
  },

  logout: (req, res) => {
    req.logout();
    res.send({error: false, msg: 'Logout successfull'});
  },

  getLoggedUser: (req, res) => {
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
        });
    } else {
      res.send({error: false, msg: 'No logged user'});
    }
  },

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   * Este método quedó obsoleto porque desde el front ya no se lo consulta.
   * Pero no se borra porque es la manera correcta de trabajar.
   */
  isAdmin: (req, res) => {
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
        });
    }
  },

};
