
const { resp } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'productoporcategoria'
];

const buscarUsuarios = async ( termino = '', res = resp ) => {
    const esMongoId = ObjectId.isValid((  termino ));

    if ( esMongoId ) {
        const usuario =  await Usuario.findById( termino );
        return res.json({ 
            results: ( usuario ) ? [ usuario ] : []
        })
    }

    const regexp = new RegExp( termino, 'i' );

    const [ usuarios, total ] = await Promise.all([
        Usuario.find({ 
            $or: [{ nombre: regexp }, { correo: regexp }],
            $and: [{ estado: true }]
        }),
        Usuario.count({ 
            $or: [{ nombre: regexp }, { correo: regexp }],
            $and: [{ estado: true }]
        })
    ]);
    
    res.json({ results: usuarios, total })

}

const buscarCategorias = async ( termino = '', res = resp ) => {

    const esMongoId = ObjectId.isValid( termino );

    if ( esMongoId ) {
        const categoria = await Categoria.findById( termino );
        return res.json({ results: ( categoria ) ? [ categoria ] : [] })
    }

    const regexp = new RegExp( termino, 'i' );

    const [ categorias, total ] = await Promise.all([
        Categoria.find({ nombre: regexp, estado: true }),
        Categoria.count({ nombre: regexp, estado: true })
    ]);

    res.json({ results: categorias, total })

}

const buscarProductos = async ( termino = '', res = resp ) => {

    const esMongoId = ObjectId.isValid( termino );

    if ( esMongoId ) {
        const producto = await Producto.findById( termino )
        .populate('categoria', 'nombre');
        return res.json({ results: ( producto ) ? [ producto ] : [] })
    }

    const regexp = new RegExp( termino, 'i' );

    const [ productos, total ] = await Promise.all([
        Producto.find({ nombre: regexp, estado: true })
        .populate('categoria', 'nombre'),
        Producto.count({ nombre: regexp, estado: true })
    ]);

    res.json({ results: productos, total })

}

const buscarProductosPorCategoria = async ( termino = '', res = resp ) => {

    const esMongoId = ObjectId.isValid( termino );

    if ( esMongoId ) {

        const [ producto, total ] = await Promise.all([
            Producto.find({ categoria: termino, estado: true, disponible: true }),
            Producto.count({ categoria: termino, estado: true, disponible: true })
        ]);

        return res.json({ results: producto, total })
    } 

    res.status( 400 ).json({ smg: `El ID: "${ termino }", no existe en categoria` });

}

const buscar = ( req, res = resp ) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status( 400 ).json({
            msg: `Las colecciones pertidas son: ${ coleccionesPermitidas }`
        })
    }

    switch ( coleccion ) {
        case 'usuarios':
            buscarUsuarios( termino, res );
        break;

        case 'categorias':
            buscarCategorias( termino, res );
        break;

        case 'productos':
            buscarProductos( termino, res );
        break;

        case 'productoporcategoria':
            buscarProductosPorCategoria( termino, res );
        break;

        default:
            res.status( 500 ).json({
                msg: `Se le olvido hacer esta busqueda`
            })
    }

}

module.exports = {
    buscar
}
