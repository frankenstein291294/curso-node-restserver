

const dbValidators  = require('./db-validator');
const generarJWT    = require('./generarJWT');
const googleVerigy  = require('./google-verify');
const subirArhivo   = require('./subir-archivo');

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerigy,
    ...subirArhivo
}
