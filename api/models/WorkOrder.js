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
    toDoList: {
      type: 'string',
      required: true,
    },
    doneList: {
      type: 'string',
    },
    doneBy: {
      model: 'user'
    },
    doneDate: {
      type: 'ref',
      columnType: 'datetime',
    },
    closeBy: {
      model: 'user'
    },
    closeDate: {
      type: 'ref',
      columnType: 'datetime',
    },
    cancelNote: {
      type: 'string',
    },
    invoiceNo: {
      type: 'string',
    },
    invoiceDate: {
      type: 'ref',
      columnType: 'datetime',
    },
    invoiceNote: {
      type: 'string',
    },
    state: {
      type: 'string',
      isIn: ['CREADA', 'COMPLETANDOSE', 'CERRADA', 'CANCELADA', 'FACTURADA'],
      defaultsTo: 'created'
    }
  },

};
