/**
 * Extinguisher.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    code: {
      type: 'string',
      required: true,
      // unique: true
    },
    customer: {
      model: 'customer',
      required: true
    },
    type: {
      model: 'extinguisherType',
      required: true
    },
    idCar: {
      type: 'string'
    },
    category: {
      type: 'string',
      isIn: ['VEHICULAR', 'DOMICILIARIO'],
    },
    location: {
      type: 'string'
    },
    costCenter: {
      type: 'string'
    },
    address: {
      type: 'string'
    },
    factoryNo: {
      type: 'number'
    },
    bvNo: {
      type: 'number'
    },
    manufacturingDate: {
      type: 'ref',
      columnType: 'date',
      required: true
    },
    lastLoad: {
      type: 'ref',
      columnType: 'date',
      required: true
    },
    lastHydraulicTest: {
      type: 'ref',
      columnType: 'date',
      required: true
    },
  },

};

