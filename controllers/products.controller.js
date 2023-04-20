
const { resp } = require('express');

const {Producto} = require('../models');


// obtenerProductos - paginacion - total - pupulate
const obtenerProductos = async ( req, res = resp ) => {

    const { desde = 0, limite = 5 } = req.query;
    const query = { 
        estado: true ,
        disponible: true
    };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments( query ),
        Producto.find( query )
        .populate( 'usuario', 'nombre' )
        .populate( 'categoria', 'nombre' )
        .skip( Number( desde ) )
        .limit( Number(limite) )
    ]);

    res.json({
        total, productos
    })

}


// obtenerProducto - pupulate
const obtenerProducto = async ( req, res = resp ) => {

    const { id } = req.params;

    const producto = await Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');

    res.json(producto)

}


// crearProducto
const crearProducto = async ( req, res = resp ) => {

    const { nombre, 
            precio, 
            categoria, 
            descripcion } = req.body;
    const nombreABuscar = nombre.toUpperCase();

    const productoDB = await Producto.findOne({ nombre: nombreABuscar })

    if ( productoDB ) {
        return res.status( 400 ).json({
            msg: `El producto: "${ nombreABuscar }" ya existe`
        });
    }

    const data = {
        nombre: nombre.toUpperCase(),
        usuario: req.usuarioAutenticado._id,
        precio,
        categoria,
        descripcion
    }

    const producto = await new Producto( data );
    await producto.save();

    res.status( 201 ).json(producto);

}


// actualizarProducto
const actualizarProducto = async ( req, res = resp ) => {

    const id = req.params.id;
    const { nombre, ...data } = req.body;

    data.nombre = nombre.toUpperCase();

    const nombreABuscar = req.body.nombre.toUpperCase();

    if (  await Producto.findOne({ nombre: nombreABuscar }) ) {
        return res.status( 400 ).json({
            msg: `El producto: ${ nombreABuscar } ya existe`
        })
    }

    if ( nombre == '' ) {
        return res.status( 400 ).json({
            msg: `Debe agregar nombre`
        });
    }

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json(producto);
}


// Eliminar producto
const eliminarProducto = async ( req, res = resp ) => {

    const id = req.params.id;

    const producto = await Producto.findOneAndUpdate(id, {estado: false}, {new: true});

    res.json({
       producto 
    })

}


module.exports = {
    obtenerProductos,
    crearProducto,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto
}

