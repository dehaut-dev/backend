const Sauce = require("../models/Sauce")
const fs = require ('fs');

exports.createSauce = (req, res, next) => {                     // création d'une sauce 
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id                                      // sup du body du model le cahmps Id qui sera incrementer par moongose directement 
    const sauce = new Sauce({                                   // création de la sauce 
        ...sauceObject,                                         // recuperation du model sans l'id
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,           // route pour la recuperation de l'image 
        likes: 0,                                                                       // création des like a 0 
        dislikes: 0,                                                                    // création des dislike a 0 
        usersLiked: JSON.stringify([]),                                                 // création d'un tableau like qui prendra en compte les id des utlisateur 
        usersDisliked: JSON.stringify([])                                               // création d'un tableau dislike qui prendra en compte les id des utlisateur 
    })
    sauce.save()                                                                // save de la sauce
        .then(() => res.status(201).json({message: 'Sauce enregistré !'}))   
        .catch(error => res.status(400).json({error}))
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, () => {                                     // supprimer un fichier 
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Sauce supprimé !'}))
                    .catch(error => res.status(400).json({error}));
            })
        })
        .catch(error => req.status(500).json({error}))
}

exports.getAllSauces = (req, res, next) => {    // method pour recuperer plusieurs sauce
    Sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({error}))
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})         // method pour recuperer une sauce 
        .then(sauce => {
            sauce = sauce.toObject()
            res.status(200).json({
                ...sauce,
                usersLiked: JSON.parse(sauce.usersLiked),  // permet de traiter les like et dislike en js 
                usersDisliked: JSON.parse(sauce.usersDisliked)
            })
        })
        .catch(error => res.status(400).json({error}))
}

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})                     // selectionne une sauce 
        .then(sauce => {
            const voteUtilisateur = req.body.like
            const idUtilisateur = req.body.userId
            let nbLike = sauce.likes
            let nbDislike = sauce.dislikes
            let usersLiked = JSON.parse(sauce.usersLiked)
            let usersDisliked = JSON.parse(sauce.usersDisliked)
            const findUserLiked = usersLiked.find((userId) => userId === idUtilisateur)
            const findUserDisliked = usersDisliked.find((userId) => userId === idUtilisateur)
            if (voteUtilisateur === 1) {                                                            // Si la personne like
                if (!findUserLiked) {
                    usersLiked.push(idUtilisateur)                                                  // push l'id de l'utilisateur
                    nbLike += 1                                                                     
                    sauce.likes = nbLike
                    sauce.usersLiked = JSON.stringify(usersLiked)
                    sauce.save()
                        .then(() => {
                            res.status(200).json({message: 'Sauce modifié !'})
                        })
                        .catch(error => res.status(400).json({error}));
                }
            }
            if (voteUtilisateur === -1) {                                                            // Si la personne dislike
                if (!findUserDisliked) {
                    usersDisliked.push(idUtilisateur)
                    nbDislike += 1
                    sauce.dislikes = nbDislike
                    sauce.usersDisliked = JSON.stringify(usersDisliked)
                    sauce.save()
                        .then(() => {
                            res.status(200).json({message: 'Sauce modifié !'})
                        })
                        .catch(error => res.status(400).json({error}));
                }
            }
            
            if (voteUtilisateur === 0) {                                                            // Si la personne annule son like
                if (findUserLiked) {
                    nbLike -= 1
                    usersLiked = usersLiked.filter((userId) => userId !== findUserLiked)
                }
                if (findUserDisliked) {                                                             // Si la personne annule son dislike
                    nbDislike -= 1
                    usersDisliked = usersDisliked.filter((userId) => userId !== findUserDisliked)
                }
                sauce.likes = nbLike
                sauce.dislikes = nbDislike
                sauce.usersLiked = JSON.stringify(usersLiked)
                sauce.usersDisliked = JSON.stringify(usersDisliked)
                sauce.save()
                    .then(() => {
                        res.status(200).json({message: 'Sauce modifié !'})
                    })
                    .catch(error => res.status(400).json({error}));
            }
        })
        .catch(error => res.status(404).json({error}))
}