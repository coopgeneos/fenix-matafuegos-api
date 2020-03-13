/**
 * Extinguisher.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    extinguisherNo: {
      type: 'number',
      required: true,
      unique: true,
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
    locationNo: {
      type: 'number',
      allowNull: true
    },
    costCenter: {
      type: 'string'
    },
    address: {
      type: 'string'
    },
    bvNo: {
      type: 'number',
      allowNull: true
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
    dps: {
      type: 'string'
    },
    mark: {
      type: 'string',
      required: true,
    }
  },

};

