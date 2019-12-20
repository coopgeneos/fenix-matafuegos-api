const sails = require('sails');
const pdf = require('html-pdf');
const moment = require('moment');

const oblea_comun = {
  row0: 33,
  row1: 41,
  row2: 55,
  matrix: [[20,45,58,71,85], [20,63,83,110,130], [20,32,109,122]],
  offset: 107,
  fontSize: 7,
  repeat: 3
};

const oblea_vehicular = {
  row0: 33,
  row1: 41,
  row2: 55,
  matrix: [[36,60,73,86,100], [36,78,100,140,160], [36,50,100,138,154,170]],
  offset: 107,
  fontSize: 7,
  repeat: 3
};

function buildHtml(oblea_conf) {
  let html = "<html><body>";
  for(let rep=0; rep<oblea_conf.repeat; rep++){
    let offset = rep * oblea_conf.offset
    for(let r=0; r<oblea_conf.matrix.length; r++){
      let rowTop = oblea_conf['row'+r] + offset;
      for(let c=0; c<oblea_conf.matrix[r].length; c++){
        let rowLeft = oblea_conf.matrix[r][c];
        html = html + `<span style="position:absolute; top:${rowTop}mm; left:${rowLeft}mm; font-size:${oblea_conf.fontSize}px">#token${r.toString()+c.toString()}</span>`
      }
    }
  }
  html = html + "</body></html>";
  return html;
}

function replaceTokens(extinguisher, html) {
  let phExp = moment(extinguisher.lastHydraulicTest).add(extinguisher.type.phExpiration, 'days');
  let nextLoad = moment(extinguisher.lastLoad).add(extinguisher.type.loadExpiration, 'days');

  /**
   * Esta matriz de valores se corresponde con el campo matrix de la configuracion de la oblea
   * Se usa para reemplazar cada token declarado
   */
  values = [
    [ extinguisher.code,
      extinguisher.manufacturingDate.getFullYear(),
      phExp.format('MM/YYYY'),
      extinguisher.type.volume,
      extinguisher.type.code
    ],
    [ 'SEGURIDAD FENIX',
      '',
      120,
      extinguisher.code,
      phExp.format('MM/YYYY'),
    ],
    [ nextLoad.format('MM'),
      nextLoad.format('YYYY'),
      nextLoad.format('MM'),
      nextLoad.format('YYYY'),
    ]
  ]
  if(extinguisher.category == 'vehiculo') {
    values[2] = [
                  nextLoad.format('MM'),
                  nextLoad.format('YYYY'),
                  extinguisher.idCar,
                  nextLoad.format('MM'),
                  nextLoad.format('YYYY'),
                  extinguisher.idCar,
                ]
  }

  for(let i=0; i<values.length; i++) {
    for(let j=0; j<values[i].length; j++) {
      let patt = new RegExp("#token"+i+j, "g");
      html = html.replace(patt, values[i][j]);
    }
  }

  return html;
}

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

  printOrder: function(req, res) {
    let id = Number(req.query.id);
    if(!id) return res.badRequest();

    Extinguisher.findOne({'id': id}).populate('type')
      .then(ext => {
        let html = ext.category == 'vehiculo' ? buildHtml(oblea_vehicular) : buildHtml(oblea_comun);
        html = replaceTokens(ext, html);
        pdf.create(html).toStream(function(err, stream) {
          if (err){
            sails.log(err);
            return res.serverError();
          }
          // res.setHeader('Content-Length', html.length);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename=matafuego.pdf');
          stream.pipe(res);
        });
      })
      .catch(err => {
        res.serverError()
      })


  }
}
