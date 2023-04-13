

const validarCampos = require('../middlewares/validar-fields');
const validarJwt = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');


module.exports = {
  ...validarCampos,
  ...validarJwt,
  ...validaRoles
}
