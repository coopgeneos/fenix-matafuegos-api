/**
 * Configuration.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    vehicularDPSPrefix: {
      type: 'string'
    },

    vehicularDPSInit: {
      type: 'number'
    },

    vehicularDPSEnd: {
      type: 'number'
    },

    vehicularDPSCurrent: {
      type: 'number'
    },

    vehicularDPSIncrement: {
      type: 'number'
    },

    domiciliaryDPSPrefix: {
      type: 'string'
    },

    domiciliaryDPSInit: {
      type: 'number'
    },

    domiciliaryDPSEnd: {
      type: 'number'
    },

    domiciliaryDPSCurrent: {
      type: 'number'
    },

    domiciliaryDPSIncrement: {
      type: 'number'
    },

  },

  nextDps: async function(conf, category) {
    let type = category == 'VEHICULAR' ? 'vehicular' : 'domiciliary';

    if(!conf[type+'DPSPrefix'] || !conf[type+'DPSInit'] || !conf[type+'DPSEnd'] || !conf[type+'DPSCurrent'] || !conf[type+'DPSIncrement']) {
      throw new Error("Falta configuracion "+ type)
    }

    if(conf[type+'DPSCurrent'] > conf[type+'DPSEnd']) {
      throw new Error("Se alcanzó el maximo de papel");
    }
  
    let dps = conf[type+'DPSPrefix'] +  conf[type+'DPSCurrent'];
  
    conf[type+'DPSCurrent'] = conf[type+'DPSCurrent'] + conf[type+'DPSIncrement'];
    let obj = {};
    obj[type+'DPSCurrent'] = conf[type+'DPSCurrent'];
    await Configuration.update({id: 1}).set(obj);
  
    return dps;
  }
  
};

