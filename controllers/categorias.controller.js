
const { resp } = require('express');
const { Categoria } = require("../models");


// obtenerCategorias - pagina - total - populate
const getCategorias = async ( req, res = resp ) => {

    const { desde, limite } = req.query;
    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Categoria.countDocuments( query ),
        Categoria.find( query )
        .populate( 'usuario',  'nombre' )
        .skip( Number( desde ) )
        .limit( Number( limite ) )
    ]);

    res.status( 200 ).json({
        total,
        usuarios
    });

}


// obtenerCategoria - pupulate {}
const obtenerCategoria = async ( req, res = resp ) => {

    // const id = req.params.id;
    const { id } = req.params;

/*     const categoria = await Categoria.findOne({ _id: id }) */
    /* .populate( 'usuario', 'nombre' ); */
    const categoria = await Categoria.findById( id )
    .populate( 'usuario', 'nombre' );

    res.json(categoria);

}


const crearCategoria = async ( req, res = resp ) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB =  await Categoria.findOne({ nombre });

    if ( categoriaDB ) {
        return res.status( 400 ).json({
            msg: `La categoria ${ categoriaDB.nombre } ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuarioAutenticado._id
    }

    const categoria = await new Categoria( data );

    await categoria.save();

    res.status(201).json( categoria );

}


// actualizarCategoria
const actualizarCategoria = async ( req, res = resp ) => {

    const { id } = req.params;
    const query = req.body;

    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuarioAutenticado._id;

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true } );

    res.status( 200 ).json({
        categoria
    });

}


// Borrar categoria - estado:false
const borrarCategoria = async ( req, res = resp ) => {

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true } );

    res.status(200).json({
        categoria
    });

}


module.exports = {
    crearCategoria,
    getCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}

