
const  { resp } = require( 'express' );

const esAdminRole = ( req, res = resp, next ) => {

  if ( !req.usuarioautenticado ) {

    return res.status( 500 ).json({
      msg: 'se quiere verificar el rol sin validar el token primero'
    });

  }

  const { rol, nombre } = req.usuarioAutenticado;

  if ( rol != 'ADMIN_ROLE' ) {
    return res.status( 401 ).json({
      mgs: `${ nombre } no es un administrado -   No puede hacer esto`
    });
  }

  next();
}

const tieneRol  = ( ...roles ) => {

  return ( req, res = resp, next ) => {
    if ( !req.usuarioAutenticado ) {
      return res.status( 500 ).json({
        msg: 'se quiere verificar el rol sin validar el token primero'
      });

    }

    if ( !roles.includes( req.usuarioAutenticado.rol ) )  {
      return res.status( 401 ).json({
        msg: `El servicio require uno de estos roles ${ roles }`
      });
    }

    next();
  }

}


module.exports = {
  esAdminRole,
  tieneRol
}
