const mongoose = require('mongoose')                    // model de sauce 

const sauceSchema = mongoose.Schema({                   // different champ requis pour l'envoi au serveur 
    userId: {type: String, require: true},
    name: {type: String, require: true},
    manufacturer: {type: String, require: true},
    description: {type: String, require: true},
    mainPepper: {type: String, require: true},
    imageUrl: {type: String, require: true},
    heat: {type: Number, require: true},
    likes: {type: Number, require: true},
    dislikes: {type: Number, require: true},
    usersLiked: {type: String, require: true},
    usersDisliked: {type: String, require: true}
})

module.exports = mongoose.model('Sauce', sauceSchema)           // export du shema de sauce 