const bcrypt = require('bcrypt');         // bibliothèque qui aide à hacher le mots de passe
const config = require('../config');
const User = require('../models/User');
const jwt = require('jsonwebtoken');      //permet aux utilisateurs de ne se connecter qu'une seule fois à leur compte

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)      // va faire 10 tour de hash sur le mdp 
      .then(hash => {
        const user = new User({             // création de l'utilisateur 
          email: req.body.email,
          password: hash                    // ajout de son mots de passe hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {                                                            // verification du mail 
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)                      // verication du mdp 
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                config.userCredentials,                                     // ajout du token d'authentification 
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };