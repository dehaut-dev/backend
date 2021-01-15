const Sauce = require("../models/Sauce")
const fs = require ('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: JSON.stringify([]),
        usersDisliked: JSON.stringify([])
    })
    sauce.save()
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
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Sauce supprimé !'}))
                    .catch(error => res.status(400).json({error}));
            })
        })
        .catch(error => req.status(500).json({error}))
}

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({error}))
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            sauce = sauce.toObject()
            res.status(200).json({
                ...sauce,
                usersLiked: JSON.parse(sauce.usersLiked),
                usersDisliked: JSON.parse(sauce.usersDisliked)
            })
        })
        .catch(error => res.status(400).json({error}))
}

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const voteUtilisateur = req.body.like
            const idUtilisateur = req.body.userId
            let nbLike = sauce.likes
            let nbDislike = sauce.dislikes
            let usersLiked = JSON.parse(sauce.usersLiked)
            let usersDisliked = JSON.parse(sauce.usersDisliked)
            const findUserLiked = usersLiked.find((userId) => userId === idUtilisateur)
            const findUserDisliked = usersDisliked.find((userId) => userId === idUtilisateur)
            // Si la personne like
            if (voteUtilisateur === 1) {
                if (!findUserLiked) {
                    usersLiked.push(idUtilisateur)
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
            // Si la personne dislike
            if (voteUtilisateur === -1) {
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
            
            if (voteUtilisateur === 0) {
                // Si la personne annule son like
                if (findUserLiked) {
                    nbLike -= 1
                    usersLiked = usersLiked.filter((userId) => userId !== findUserLiked)
                }
                // Si la personne annule son dislike
                if (findUserDisliked) {
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