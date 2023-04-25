

const validarCampos = require('../middlewares/validar-fields');
const validarJwt = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');
const validarArchivoSubir = require('./validar-archivo');


module.exports = {
    ...validarCampos,
    ...validarJwt,
    ...validaRoles,
    ...validarArchivoSubir
}
