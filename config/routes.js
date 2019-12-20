/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },

  /* Controlador que implementa el count en los modelos */
  'get /:modelName/count': 'CountController.count',

	/* Rutas relativas a login */
  'post /login': 'AuthController.login',
  '/logout': 'AuthController.logout',
  
  /* Rutas relativas a la facturación */
  'get /workorder/toinvoice': 'WorkOrderController.ordersToInvoice',
  'post /workorder/invoice': 'WorkOrderController.invoiceOrders',
  'get /workorder/print': 'WorkOrderController.printOrder',

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
 
