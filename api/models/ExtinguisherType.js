/**
 * ExtinguisherType.js
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
    category:{
      type: 'string',
      isIn: ['A','ABC','AC','AB','BC','ABCD','D','K']
    },
    loadExpiration: {
      type: 'number',
      defaultsTo: 365
    },
    phExpiration: {
      type: 'number',
    },
    volume: {
      type: 'number',
      columnType: 'float'
    },
    weight: {
      type: 'number',
      columnType: 'float'
    }
  },

};

