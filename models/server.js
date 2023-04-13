
const express = require('express')
const cors = require('cors');
const {dbConnection} = require('../db/config');

class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.usuariosPath = '/api/usuarios';

    // Conecar a base de datos
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi applicacion
    this.routes();
  }

  async conectarDB () {
    await dbConnection();
  }

  middlewares () {
    // Cors
    this.app.use( cors() );

    // Lectura y parseo del body a json, cualquier informacion la serializara a json
    this.app.use( express.json() );

    // Directorio publico
    this.app.use( express.static( 'public' ) );
  }

  routes() {
    this.app.use( this.usuariosPath, require( '../routes/users.routes' ) );
  }

  listen () {
    this.app.listen( this.port, () => {
      console.log('listen in port ' + this.port);
    } );
  }

}

module.exports = Server;
