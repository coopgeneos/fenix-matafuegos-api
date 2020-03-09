async function getNextVehicularDps() {
  let conf = await Configuration.findOne({id: 1});
  if(conf.vehicularDPSCurrent > conf.vehicularDPSEnd) {
    throw new Error("Se alcanzó el maximo de papel");
  }

  let dps = conf.vehicularDPSPrefix +  conf.vehicularDPSCurrent;

  conf.vehicularDPSCurrent = conf.vehicularDPSCurrent + conf.vehicularDPSIncrement;
  await Configuration.update({id: 1}).set({vehicularDPSCurrent: conf.vehicularDPSCurrent});

  return dps;
}

async function getNextDomicialiaryDps() {
  let conf = await Configuration.findOne({id: 1});
  if(conf.domiciliaryDPSCurrent > conf.domiciliaryDPSEnd) {
    throw new Error("Se alcanzó el maximo de papel");
  }

  let dps = conf.domiciliaryDPSPrefix +  conf.domiciliaryDPSCurrent;

  conf.domiciliaryDPSCurrent = conf.domiciliaryDPSCurrent + conf.domiciliaryDPSIncrement;
  Configuration.updateOne({id: 1}).set({domiciliaryDPSCurrent: conf.domiciliaryDPSCurrent});

  return dps;
}

async function assignDPS(_id, conf) {
  try {
    let array = [];
    let order = await WorkOrder.findOne({id: _id}).populate('extinguisher');
    let category = order.extinguisher.category;
    let extinguisher = order.extinguisher;
    let seq_dps = await Configuration.nextDps(conf, category);
    await Extinguisher.update({id: extinguisher.id}).set({dps: seq_dps});
    await WorkOrder.update({id: order.id}).set({state: 'IMPRESA'});
    return;
  } catch(err) {
    throw new Error(err)
  }
}

module.exports = {
  ordersToInvoice: function(req, res) {
    let _SQL = `
      SELECT wo.id, wo.customer as "customerId", c.name as "customerName", e."extinguisherNo", e."costCenter" , wo."toDoList"
      FROM workorder wo
      JOIN extinguisher e on (wo.extinguisher = e.id)
      JOIN customer c on(wo.customer = c.id)
      WHERE wo.state = $1
      ORDER BY wo.customer, e."costCenter"`;

    // Send it to the database.
    sails.sendNativeQuery(_SQL, [ 'IMPRESA' ])
      .then(rawResult => {
        res.send(rawResult.rows)
      })
      .catch(err => {
        res.send(err)
      })
  },

  invoiceOrders: function(req, res) {
    if(!req.body.invoiceNo ||
      !req.body.invoiceDate ||
      !req.body.invoiceNote ||
      !req.body.ids)
      return res.badRequest();

    let iNo = req.body.invoiceNo;
    let iDate = req.body.invoiceDate;
    let iNote = req.body.invoiceNote;
    let ids = req.body.ids

    let _SQL = `
      UPDATE workorder SET "invoiceNo" = $1, "invoiceDate" = $2, "invoiceNote" = $3, state = $4
      WHERE id IN (${ids})
    `;

    // Send it to the database.
    sails.sendNativeQuery(_SQL, [iNo,iDate,iNote,'FACTURADA'])
      .then(_ => {
        res.send({});
      })
      .catch(err => {
        console.error(err);
        res.serverError();
      })
  },

  ordersToPrint: function(req, res) {
    let _SQL = `
      SELECT wo.id, wo.customer as "customerId", c.name as "customerName", e.id as "extinguisherId", e."extinguisherNo", e.category as "extinguisherCategory", e."costCenter" , wo."toDoList"
      FROM workorder wo
      JOIN extinguisher e on (wo.extinguisher = e.id)
      JOIN customer c on(wo.customer = c.id)
      WHERE wo.state = $1
      ORDER BY wo.customer, e."costCenter"`;

    // Send it to the database.
    sails.sendNativeQuery(_SQL, [ 'CERRADA' ])
      .then(rawResult => {
        res.send(rawResult.rows)
      })
      .catch(err => {
        res.send(err)
      })
  },

  printOrders: async function(req, res) {
    if(!req.body.ids)
      return res.badRequest();

    let ids = req.body.ids;

    try {
      let promises = [];
      let conf = await Configuration.findOne({id: 1});
      ids.forEach(async (_id) => {
        promises.push(assignDPS(_id, conf))
        // let order = await WorkOrder.findOne({id: _id}).populate('extinguisher');
        // let category = order.extinguisher.category;
        // let extinguisher = order.extinguisher;
        // let seq_dps = await Configuration.nextDps(conf, category);
        // await Extinguisher.update({id: extinguisher.id}).set({dps: seq_dps});
        // await WorkOrder.update({id: order.id}).set({state: 'IMPRESA'});
      });

      let values = await Promise.all(promises);
    
      let pdfStream = await sails.helpers.dpsPrinter(ids);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=impresiondps.pdf`);
      pdfStream.pipe(res);
    } catch(err) {
      res.serverError()
    }
    
    
  },

}
