const { Router } = require( 'express' );
const {check} = require('express-validator');

const { existeCategoria, 
        existeUsuarioPorId, 
        existeCategoriaByName } = require( '../helpers/db-validator' );

const { crearCategoria, 
        getCategorias, 
        obtenerCategoria, 
        actualizarCategoria, 
        borrarCategoria} = require('../controllers/categorias.controller');

const {validarCampos, validarJwt, tieneRol} = require('../middlewares');


const router =  new Router();

/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorias -  publico
router.get('/', getCategorias);

// Obtener una categoria por id - publico
router.get( '/:id', [

    check( 'id', 'No es un ID validdo' ).isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos

], obtenerCategoria );


// Crear categoria - privado - cualquier persona con un token valido
router.post('/', [ 
    validarJwt,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);


// Actualizar -  privado - cualquiera con token valido
router.put( '/:id', [
    validarJwt,
    check('id', 'El ID no es valido').isMongoId(),
    check('id').custom(existeCategoria),
    check('nombre', 'Nombre de categoria es obligatorio').not().isEmpty(),
    check('usuario').custom(existeUsuarioPorId),
    check('nombre').custom(existeCategoriaByName),
    validarCampos
], actualizarCategoria );

// Borrar un categoria - admin
router.delete('/:id',[
    validarJwt,
    tieneRol('ADMIN_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], borrarCategoria );


module.exports = router;
