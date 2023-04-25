
const express = require('express')
const cors = require('cors');
const {dbConnection} = require('../db/config');
const fileUpload = require('express-fileupload');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            usuarios:   '/api/usuarios',
            products:   '/api/productos',
            uploads:    '/api/uploads'
        }

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

        // File uploads
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use( this.paths.auth, require( '../routes/auth' ) );
        this.app.use( this.paths.buscar, require( '../routes/buscar.routes' ) );
        this.app.use( this.paths.usuarios, require( '../routes/users.routes' ) );
        this.app.use( this.paths.categorias, require( '../routes/categorias.routes' ) );
        this.app.use( this.paths.products, require( '../routes/products.routes' ) );
        this.app.use( this.paths.uploads, require( '../routes/uploads.routes' ) );
    }

    listen () {
        this.app.listen( this.port, () => {
            console.log('listen in port ' + this.port);
        } );
    }

}

module.exports = Server;
