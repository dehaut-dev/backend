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
    .then(sauce => {})
    .catch(error => res.status(400).json({error}))
}