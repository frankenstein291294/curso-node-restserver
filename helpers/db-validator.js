
const { Categoria, Usuario, Producto } = require('../models');
const Role = require( '../models/role' );


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

const existeCategoria = async ( id ) => {
    const existeCategoria = await Categoria.findById( id );
    if ( !existeCategoria ) {
        throw new Error( `El ID ${ id } no existe en categoria` );
    }
}

const existeCategoriaByName = async ( nombre ) => {
    const existeCategoria = await Categoria.find({ nombre });

    // console.log( existeCategoria.length ==  );

    if ( existeCategoria.length > 0 ) {
        throw new Error( `La categoria "${ nombre }" ya existe` );
    }
}

const existeProductoPorId = async ( id ) => {
    const existeProducto = await Producto.findById( id );
    if ( !existeProducto ) {
        throw new Error( `El id "${ id }" no existe` );
    }
}


module.exports = {
    esRolValido,
    existeEmail,
    existeUsuarioPorId,
    existeCategoria,
    existeCategoriaByName,
    existeProductoPorId
}
