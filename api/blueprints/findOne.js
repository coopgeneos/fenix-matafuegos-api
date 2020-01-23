/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
var formatUsageError = require('sails/lib/hooks/blueprints/formatUsageError');

/**
 * Find One Record
 *
 * http://sailsjs.com/docs/reference/blueprint-api/find-one.
 *
 * > Blueprint action to find and return the record with the specified id.
 *
 */

module.exports = function findOneRecord (req, res) {

  var parseBlueprintOptions = req.options.parseBlueprintOptions || req._sails.config.blueprints.parseBlueprintOptions;

  // Set the blueprint action for parseBlueprintOptions.
  req.options.blueprintAction = 'findOne';

  var queryOptions = parseBlueprintOptions(req);
  var Model = req._sails.models[queryOptions.using];

  // Only use the `where`, `select` or `omit` from the criteria (nothing else is valid for findOne).
  queryOptions.criteria = _.pick(queryOptions.criteria, ['where', 'select', 'omit']);

  // Only use the primary key in the `where` clause.
  queryOptions.criteria.where = _.pick(queryOptions.criteria.where, Model.primaryKey);

  // Si entre los parametros viene force, entonces busco tambien entre los eliminados,
  // si no, agrego el parametro "deleted = false". En esta ultimo caso, puede que 
  // el resultado no sea el esperado
  queryOptions.criteria.where['force'] ? 
    delete queryOptions.criteria.where['force'] :
    queryOptions.criteria.where['deleted'] = false;

  Model
  .findOne(queryOptions.criteria, queryOptions.populates).meta(queryOptions.meta)
  .exec(function found(err, matchingRecord) {
    if (err) {
      // If this is a usage error coming back from Waterline,
      // (e.g. a bad criteria), then respond w/ a 400 status code.
      // Otherwise, it's something unexpected, so use 500.
      switch (err.name) {
        case 'UsageError': return res.badRequest(formatUsageError(err, req));
        default: return res.serverError(err);
      }
    }//-•

    if(!matchingRecord) {
      req._sails.log.verbose('In `findOne` blueprint action: No record found with the specified id (`'+queryOptions.criteria.where[Model.primaryKey]+'`).');
      return res.notFound();
    }

    if (req._sails.hooks.pubsub && req.isSocket) {
      Model.subscribe(req, [matchingRecord[Model.primaryKey]]);
      actionUtil.subscribeDeep(req, matchingRecord);
    }

    return res.ok(matchingRecord);

  });

};