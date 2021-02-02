const multer = require('multer')

const MIMI_TYPES = {                                // type de fichier accepté
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
}

const storage = multer.diskStorage({                    // enregistrement sur le disque 
    destination: (req, file, callback) => {
        callback(null, 'images')                        // destination des images
    },
    filename: (req, file, callback) => {                // utilise le nom d'origine de la sauce 
        const sauce = JSON.parse(req.body.sauce)    
        const name = sauce.name.split(' ').join('_')        // suprime les espaces et les underscore 
        const extension = MIMI_TYPES[file.mimetype]            //extention du nom l'image 
        callback(null, name + Date.now() + '.' + extension)     // ajoute un timestamp au nom de fichier 
    }
})

module.exports = multer({storage}).single('image')