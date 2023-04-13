const {response} = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require( '../models/usuario.model' );
const {generarJWT} = require("../helpers/generar-jwt");


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

module.exports = {
  login
};
