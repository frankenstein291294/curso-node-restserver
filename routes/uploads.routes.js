const { Router } = require( 'express' );
const {check} = require('express-validator');
const {validarCampos, validarArchivoSubir} = require('../middlewares');

const {cargarArchivo, actualizarImagen, mostratImagen, actualizarImagenCloudinary} = require('../controllers/uploads.controller');
const {coleccionesPermitidas} = require('../helpers/db-validator');


const router =  new Router();

router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El ID no es un mongo ID').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], actualizarImagenCloudinary);
// ], actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'El ID no es un mongo ID').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], mostratImagen);

module.exports = router;
