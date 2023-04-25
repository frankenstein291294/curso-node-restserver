
const path = require('path');
const fs = require('fs');
const { resp } = require('express');
const {subirArchivo} = require('../helpers/subir-archivo');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { Usuario, Producto }  = require( '../models' );

const cargarArchivo = async ( req, res = resp ) => {

    try {
        
        // Imagenes
        const nombre =  await subirArchivo( req.files, undefined, 'imgs' );

        res.json({
            nombre
        })
    } catch (err) {
        res.status(400).json({ err })
    }
}


const actualizarImagen = async ( req, res = resp ) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({msg: `No existe un usuario con el id ${ id }`})
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({msg: `No existe un producto con el id ${ id }`})
            }
        break;

        case 'default':
        return res.status(500).json({ smg: 'Se me olvido validar esto' });
    }

    // Limpiar imagenes previas
    if ( modelo.img ) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
    
        if ( fs.existsSync( pathImagen ) ) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre =  await subirArchivo( req.files, undefined, coleccion );
    modelo.img = nombre;

    await modelo.save();


    res.json({ modelo });

}


const actualizarImagenCloudinary = async ( req, res = resp ) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({msg: `No existe un usuario con el id ${ id }`})
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({msg: `No existe un producto con el id ${ id }`})
            }
        break;

        case 'default':
        return res.status(500).json({ smg: 'Se me olvido validar esto' });
    }

    // Limpiar imagenes previas
    if ( modelo.img ) {

        const nobraArr = modelo.img.split('/');
        const nombre = nobraArr[nobraArr.length - 1];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );

    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    modelo.img = secure_url;

    modelo.save();

    res.json({ modelo });

}


const mostratImagen = async (req, res = resp) => {

    const { id, coleccion } = req.params;
    const placeholer = path.join( __dirname, '../assets/no-image.jpg' );

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.sendFile( placeholer );
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.sendFile( placeholer );
            }
        break;

        case 'default':
        return res.status(500).json({ smg: 'Se me olvido validar esto' });
    }

    // Limpiar imagenes previas
    if ( modelo.img ) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
    
        if ( fs.existsSync( pathImagen ) ) {
            return res.sendFile( pathImagen );
        }
    }

    res.sendFile( placeholer )

}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostratImagen,
    actualizarImagenCloudinary
}
