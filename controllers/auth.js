const {response} = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require( '../models/usuario.model' );
const {generarJWT} = require("../helpers/generar-jwt");
const {googleVerify} = require("../helpers/google-verify");


const  login = async  ( req, res = response ) => {

  const { correo, password } = req.body;

  try {

    // Verificar si el email existeEmail
    const usuario = await Usuario.findOne({ correo });
    if ( !usuario ) { 
      return res.status(400).json({
        msg: 'Usuario / contraseña incorrectos - correo'
      })
    }

    // Si el usuario esta activo
    if ( !usuario.estado ) { 
      return res.status(400).json({
        msg: 'Usuario / contraseña incorrectos - estado: false'
      })
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync( password, usuario.password );

    if ( !validPassword ) { 
      return res.status(400).json({
        msg: 'Usuario / contraseña incorrectos - password'
      })
    }
    
    // Generar el JWT
    const  token = await generarJWT( usuario.id );

    res.json({
      usuario,
      token
    });

  } catch (error) {
    console.log( error );
    res.status(500).json({
      msg: 'Algo salio mal'
    })
  }

}



const googleSingIn = async ( req, res = resp ) => {

  const { id_token } = req.body;

  try {

    const { nombre, img, correo } = await googleVerify( id_token );

    let usuario = await Usuario.findOne({ correo });

    if ( !usuario )  {
      // Tengo que crearlo
      const data = {
        nombre,
        correo,
        password: ':P',
        img,
        google: true,
        // rol: 'USER_ROLE'
      };

      usuario = new Usuario( data );
      usuario.save();
    }

    // Si el usuario en BD
    if ( !usuario.estado ) {
      return res.status( 401 ).json({
        msg: 'Hable con el administrar, usuario bloqueado'
      })
    }

    // Generar el JWT
    const token = await generarJWT( usuario.id );
    
    res.json({
      usuario,
      token
    })

  } catch (error) {

    res.status( 400 ).json({
      ok: false,
      msg: 'El token no se pudo verificar'
    })

  }

}



module.exports = {
  login,
  googleSingIn
};
