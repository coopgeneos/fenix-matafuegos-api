/**
 * ExtinguisherController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const sails = require('sails');
const pdf = require('html-pdf');
const moment = require('moment');

const CATEGORY_TYPE = {
  VEHICULAR: 'VEHICULAR',
  DOMICILIARIO: 'DOMICILIARIO'
}

// La estrategia para posicionar los puntos es estableciendo de manera fija el primer 
// token de arriba a la izquierda (posicion [0][0] - #token00), y luego establecer los restantes con 
// respecto a este, es decir, cuanto se debe desplazar hacia la derecha (x) y cuanto 
// hacia abajo (y).
// Con esta estrategia si se posicionan bien los valores, con solo mover el valor en [0][0],
// se mueve toda la info (una manera de agrupación)
const d_conf = {
  positions: [
    /* [{x:20,y:33},{x:25,y:0},{x:38,y:0},{x:51,y:0},{x:65,y:0}],
    [{x:0,y:8},{x:43,y:8},{x:63,y:8},{x:90,y:8},{x:110,y:8}],
    [{x:0,y:22},{x:12,y:22},{x:89,y:22},{x:102,y:22}] */
    /* [{x:85,y:120},{x:85,y:0},{x:135,y:0},{x:190,y:0},{x:230,y:0}],
    [{x:0,y:40},{x:165,y:40},{x:230,y:40},{x:330,y:40},{x:395,y:40}],
    [{x:0,y:90},{x:45,y:90},{x:325,y:90},{x:370,y:90}] */
    [{x:17,y:24},{x:15,y:0},{x:25,y:0},{x:35,y:0},{x:44,y:0}],
    [{x:0,y:6},{x:27,y:6},{x:44,y:6},{x:64,y:6},{x:75,y:6}],
    [{x:0,y:15},{x:8,y:15},{x:64,y:15},{x:70,y:15}]
  ],
  repetitions: 3,
  offset: 76,
  fontSize: 7, 
  paper: {
    /* height: "1210px",
    width: "670px", */
    height: "304 mm",
    width: "170 mm",
    margin: "0",
  }
}

const v_conf = {
  positions: [
    /* [{x:36,y:33},{x:24,y:0},{x:37,y:0},{x:50,y:0},{x:64,y:0}],
    [{x:0,y:8},{x:42,y:8},{x:64,y:8},{x:104,y:8},{x:124,y:8}],
    [{x:0,y:22},{x:14,y:22},{x:64,y:22},{x:102,y:22},{x:118,y:22},{x:134,y:22}] */
    [{x:27,y:22},{x:15,y:0},{x:25,y:0},{x:35,y:0},{x:47,y:0}],
    [{x:0,y:6},{x:27,y:6},{x:47,y:6},{x:73,y:6},{x:85,y:6}],
    [{x:0,y:15},{x:12,y:15},{x:45,y:15},{x:73,y:15},{x:82,y:15},{x:95,y:15}]
  ],
  repetitions: 3,
  offset: 76,
  fontSize: 7, 
  paper: {
    height: "304 mm",
    width: "200 mm",
    margin: "0",
    /* orientation: "portrait",
    format: "Legal" */
  }
}

function buildHtml(conf) {
  let html = "<html><body>";
  for(let rep=0; rep<conf.repetitions; rep++){
    let offset = rep * conf.offset;
    let initial = {x: conf.positions[0][0].x, y: conf.positions[0][0].y + offset};
    for(let r=0; r<conf.positions.length; r++){
      for(let c=0; c<conf.positions[r].length; c++){
        let point = {x: initial.x + conf.positions[r][c].x, y: initial.y + conf.positions[r][c].y};
        if(r == 0 && c == 0)
          point = initial;
        html = html + `<span style="position:absolute; top:${point.y}mm; left:${point.x}mm; font-size:${conf.fontSize}px">#token${r.toString()+c.toString()}</span>`
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
    [ 
      extinguisher.code,
      extinguisher.manufacturingDate.getFullYear(),
      phExp.format('MM/YYYY'),
      extinguisher.type.volume,
      extinguisher.type.code
    ],
    [ 
      'SEGURIDAD FENIX',
      '',
      120,
      extinguisher.code,
      phExp.format('MM/YYYY'),
    ],
    [ 
      nextLoad.format('MM'),
      nextLoad.format('YYYY'),
      nextLoad.format('MM'),
      nextLoad.format('YYYY'),
    ]
  ]
  if(extinguisher.category == CATEGORY_TYPE.VEHICULAR) {
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
  print: function(req, res) {
    let id = Number(req.query.id);
    if(!id) return res.badRequest();
    Extinguisher.findOne({'id': id}).populate('type')
      .then(ext => {
        let config = ext.category == CATEGORY_TYPE.VEHICULAR ? v_conf : d_conf;
        let html = buildHtml(config);
        html = replaceTokens(ext, html);
        pdf.create(html, config.paper).toStream(function(err, stream) {
          if (err){
            sails.log(err);
            return res.serverError();
          }
          // res.setHeader('Content-Length', html.length);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename=${ext.code}.pdf`);
          stream.pipe(res);
        });
      })
      .catch(err => {
        res.serverError()
      })
  }

};

