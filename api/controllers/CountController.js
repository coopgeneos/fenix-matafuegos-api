/**
 * CountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {
  count : async function (req, res) {
    try {
      let Model    = sails.models[req.param('modelName')],
          criteria = actionUtil.parseCriteria(req);

      if (!Model) {
        return res.badRequest('invalid_parameter');
      }

      delete criteria.modelName;

      let count = await Model.count(criteria);
      res.ok({count: count});

    } catch(err) {
      res.serverError('database_error', error);
    }
  }
};

