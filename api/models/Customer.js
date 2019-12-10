/**
 * Customer.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    code: {
      type: 'string',
      required: true,
      unique: true
    },
    name: {
      type: 'string',
      required: true,
    },
    address: {
      type: 'string',
      required: true,
    },
    phone: {
      type: 'string',
      required: true,
      unique: true
    },
    email: {
      type: 'string',
      required: true,
      isEmail: true
    },
    web: {
      type: 'string',
      isURL: true
    },
    type: {
      type: 'string',
      required: true,
      isIn: ['vehicular', 'empresa']
    },
  },

};

