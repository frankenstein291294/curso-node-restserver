const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'git'], carpeta = '' ) => {

    return new Promise( ( resolve, reject ) => {

        const { archivo } = files;
        const nombreCordado = archivo.name.split('.');
        const extension = nombreCordado[ nombreCordado.length - 1 ];


        if ( !extensionesValidas.includes( extension ) ) {
            return reject(`La extension ${ extension } no es valida - ${ extensionesValidas }`);
        }

        const nombreTmp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTmp);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject( err );
            }

            resolve( nombreTmp );
            // res.json({ msg: 'File uploaded to ' + uploadPath });
        });

    } )

}

module.exports = {
    subirArchivo
}
