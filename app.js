const express = require('express');
const bodyParser = require('body-parser');              // permet l'exploitation des données
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config');

const userRoutes = require('./routes/user');                // importation des routes 
const sauceRoutes = require('./routes/sauce');

mongoose.connect(`mongodb+srv://${config.mongoCredentials}@cluster0.8qplx.mongodb.net/<dbname>?retryWrites=true&w=majority`, {          // connection a mongo 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {                                   // va permetre d'enlever le bloquage des appels HTTP entre les les port 3000 et 4200
    res.setHeader('Access-Control-Allow-Origin', '*');          // permet d'accéder à notre API depuis n'importe quelle origine 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');  // ajoute les headers mentionnés
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');  // permet d'envoyer des requêtes avec les méthodes mentionnées
    next();
});

app.use(bodyParser.json());                                     // transforme la requete en Json
app.use('/images', express.static(path.join(__dirname, 'images')))      // gérer la ressource images

app.use('/api/auth/', userRoutes);          // def de la route a utiliser 
app.use('/api/sauces', sauceRoutes);

module.exports = app;