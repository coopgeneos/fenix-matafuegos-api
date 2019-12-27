/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  '*': true,

  'AuthController': {
    'logout': ['isAuthenticated'],
    'isAdmin': ['isAuthenticated']
  },

  'CountController': {
    '*': ['isAuthenticated']
  },

  'UserController': {
    'find':  ['isAuthenticated'],
    '*': ['isAuthenticated', 'isAdmin']
  },

  'CustomerController': {
    'find': ['isAuthenticated'],
    '*': ['isAuthenticated', 'isAdmin']
  },

  'ExtinguisherController': {
    'find':  ['isAuthenticated'],
    '*': ['isAuthenticated', 'isAdmin']
  },

  'ExtinguisherTypeController': {
    'update': ['isAuthenticated'],
    '*': ['isAuthenticated', 'isAdmin']
  },

  'WorkOrderController': {
    'update': ['isAuthenticated'],
    'find': ['isAuthenticated'],
    'findOne': ['isAuthenticated'],
    '*': ['isAuthenticated', 'isAdmin']
  }

};
