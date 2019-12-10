/**
 * WorkOrder.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    orderNo: {
      type: 'number',
      required: true,
      unique: true
    },
    customer: {
      model: 'customer',
      required: true
    },
    extinguisher: {
      model: 'extinguisher',
      required: true
    },
    closeBy: {
      model: 'user'
    },
    closeDate: {
      type: 'ref',
      columnType: 'datetime',
      required: true
    },
  },

};

