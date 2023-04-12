
const { requ, resp } = require('express');

// Method GET
const usuariosGet = ( req = requ, res = resp ) => {
  const { q, nombre = 'no name', apikey } = req.query;

  res.json({
    msg: 'get API - controllers',
    q,
    nombre, 
    apikey
  })
}

// Method PUT
const usuariosPut = ( req, res = resp ) => {
  const id = req.params.id;

  res.status( 401 ).json({
    msg: 'put API - controller',
    id
  })
}

// Method POST
const usuariosPost = ( req, res = resp ) => {
  const { nombre, edad } = req.body;

  res.json({
    msg: 'post API - controller',
    nombre,
    edad
  })
}

// Method DELETE
const usuariosDelete = ( req, res = resp ) => {
  res.json({
    msg: 'delete API - controller'
  })
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
