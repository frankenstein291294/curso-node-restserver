
const { Router } = require( 'express' );
const {check} = require('express-validator');

const {validarCampos} = require('../middlewares/validar-fields');
const { esRolValido, 
        existeEmail, 
        existeUsuarioPorId} = require('../helpers/db-validator');

const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch } = require('../controllers/usuarios.controller');

const router = Router();

router.get( '/', usuariosGet );


router.put( '/:id',[

  check( 'id', 'No es un ID valido' ).isMongoId(),
  check( 'id' ).custom( existeUsuarioPorId ),
  check( 'rol' ).custom( esRolValido ),
  validarCampos

], usuariosPut );


router.post( '/', [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El password es obligatorio').isLength({ min:6 }),
  check('correo', 'El coreo no es valido').isEmail(),
  // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  // Validar un custom rol registrado desde la base de datos
  check( 'rol' ).custom( esRolValido ),
  check( 'correo' ).custom( existeEmail ),
  validarCampos
], usuariosPost );


router.delete( '/:id',[

  check( 'id', 'No es un ID valido' ).isMongoId(),
  check( 'id' ).custom( existeUsuarioPorId ),
  validarCampos

], usuariosDelete );


router.patch( '/', usuariosPatch );


module.exports = router;
