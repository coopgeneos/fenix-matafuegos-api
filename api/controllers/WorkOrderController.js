module.exports = {
  ordersToInvoice: function(req, res) {
    let _SQL = `
      SELECT wo.id, wo.orderNo, wo.customer as customerId, c.name as customerName, e.code as extinguisherCode, e.costCenter , wo.doneList
      FROM workorder wo
      JOIN extinguisher e on (wo.extinguisher = e.id)
      JOIN customer c on(wo.customer = c.id)
      WHERE wo.state = $1
      ORDER BY wo.customer, e.costCenter`;

    // Send it to the database.
    sails.sendNativeQuery(_SQL, [ 'CERRADA' ])
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
      UPDATE workorder SET invoiceNo = $1, invoiceDate = $2, invoiceNote = $3, state = $4
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

}
