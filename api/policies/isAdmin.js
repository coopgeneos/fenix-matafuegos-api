/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

module.exports = function(req, res, next) {
  User.findOne({id: req.user.id, role: 'admin'}).exec(function(err, user){
    if(user) {
      return next()
    }
    //respond with 401
    return res.sendStatus(401);
  });
};
