const { requ, resp } = require('express');
const jwt = require('jsonwebtoken');

const Usuario =   require('../models/usuario.model');

const validarJwt = async ( req = requ, res = resp, next ) => {

  const token = req.header( 'x-token' );

  // Validamos si va un token
  if ( !token ) {
    return res.status( 401 ).json({
      msg: 'No hay token en la peticion'
    })
  }


  // Validamos el un token valido
  try {

    // const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
    const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

    // const usuario = await Usuario.findOne({ _id: uid });
    const usuario = await Usuario.findById( uid );

    if ( !usuario ) {
      return res.status( 401 ).json({
        msg: 'Usuario no exite en base de datos'
      })
    }

    // Verficar si el uid tiene estado en true
    if ( !usuario.estado ) {
      return res.status( 401 ).json({
        msg: 'Token no  valido - usuario con estado false'
      })
    }

    req.usuarioAutenticado = usuario;
    next();

  } catch (error) {
    console.log( error );
    res.status( 401 ).json({
      msg: 'Token valido'
    })
  }


}


module.exports = {
  validarJwt
}
