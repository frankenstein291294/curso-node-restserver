const { Router } = require('express');
const { check } = require('express-validator');

const { existeCategoria,
        existeProductoPorId, 
        existeUsuarioPorId} = require('../helpers/db-validator');

const { crearProducto, 
        obtenerProductos,
        obtenerProducto,
        actualizarProducto, 
        eliminarProducto } = require('../controllers/products.controller');

const { validarCampos,
        validarJwt,
        esAdminRole,
        tieneRol} = require('../middlewares');

const router = new Router();

// Obtener todos los prodcutos - public
router.get('/', obtenerProductos)


// Obtener producto por id - public
router.get('/:id',[
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto)


// Crear producto - private - cualquier con token valido
router.post('/',[
    validarJwt,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('precio', 'El precios no es valido').isFloat(),
    check('categoria', 'La categoria no es valida').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
], crearProducto)


// Actualizar - private - cualquiera con token valido
router.put('/:id', [
    validarJwt,
    check('id', 'El ID no es valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    check('nombre', 'El nombre es obligatorio').isString(),
    check('estado', 'El estado debe ser boolean').isBoolean(),
    check('usuario', 'El usuario no es valido').isMongoId(),
    check('usuario').custom(existeUsuarioPorId),
    check('precio', 'El precio es invalido').isFloat(),
    check('categoria', 'La categoria no es valida').isMongoId(),
    check('categoria').custom(existeCategoria),
    check('disponible', 'La disponibilidad debe ser boolean').isBoolean(),
    validarCampos
], actualizarProducto);


// Eliminar - private - cualquier con token valido
router.delete('/:id',[
    validarJwt,
    tieneRol('ADMIN_ROLE'),
    check('id', 'El ID no es valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], eliminarProducto);


module.exports = router;
