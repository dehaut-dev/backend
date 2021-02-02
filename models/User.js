const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');     

const userSchema = mongoose.Schema({                      // model pour la création d'un user 
  email: { type: String, required: true, unique: true},   // requiere un email        /  avec la proprietée unique l'utilisateur ne poura etre crée qu'une fois 
  password: { type: String, required: true }              // et un mots de passe 
}); 

userSchema.plugin(uniqueValidator);                       // plugin qui ajoute une validation en verifiant qu'un utilisateur est crée une seul fois 

module.exports = mongoose.model('User', userSchema);      // export du shema user 