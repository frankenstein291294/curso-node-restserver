
const { requ, resp } = require('express');

const bcryptjs = require('bcryptjs');

const Usuario =   require('../models/usuario.model');

// Method GET
const usuariosGet = async ( req = requ, res = resp ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
        .skip( Number( desde ) )
        .limit( Number( limite ) )
    ]);

    res.json({
        total,
        usuarios
    })
}

// Method PUT
const usuariosPut = async ( req, res = resp ) => {
    const id = req.params.id;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO: Validar contra base de datos
    if ( password ) {

        // Encriptar la contraseña
        const salt =  bcryptjs.genSaltSync( 10 );
        resto.password =  bcryptjs.hashSync( password, salt );

    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true});

    res.status( 401 ).json( usuario );
}

// Method POST
const usuariosPost = async ( req, res = resp ) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );

    // Encriptar la contraseña
    const salt =  bcryptjs.genSaltSync( 10 );
    usuario.password =  bcryptjs.hashSync( password, salt );

    // Guardar db
    await usuario.save();

    res.json({
        msg: 'post API - controller',
        usuario
    })
}


// Method DELETE
const usuariosDelete = async ( req = requ, res = resp ) => {

    const { id } = req.params;

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false }, {new: true} );
    // const usuarioAutenticado = req.usuarioAutenticado;

    res.json(usuario)
}


// Method PATCH
const usuariosPatch = ( req, res = resp ) => {
    res.json({
        msg: 'patch API - controller'
    })
}


module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}
