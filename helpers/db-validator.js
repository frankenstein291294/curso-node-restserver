
const Role = require( '../models/role' );
const Usuario = require( '../models/usuario.model' );


const esRolValido = async ( rol = '' ) => {
  const existeRol = await Role.findOne({ rol });
  if ( !existeRol ) {
    throw new Error(`El rol ${ rol } no esta registrado en la base de datos`);
  }
}


const existeEmail = async ( correo = '' ) => {
  const existeEmail = await Usuario.findOne({ correo });
  if ( existeEmail ) {
    throw new Error( `El corre ${ correo } ya esta registrado` );
  }
}


const existeUsuarioPorId = async ( id ) => {
  const existeUsuario = await Usuario.findById( id );
  if ( !existeUsuario ) {
    throw new Error( `El ID ${ id } no exite` );
  }
}


module.exports = {
  esRolValido,
  existeEmail,
  existeUsuarioPorId
}
