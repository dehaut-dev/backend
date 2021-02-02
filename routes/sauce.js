const express = require('express')
const router = express.Router()
const sauceCtrl = require('../controllers/sauce')               // les differentes routes sont incrementé par le controleur sauce
const auth = require('../middleware/auth')          
const multer = require('../middleware/multer-config')           

router.get('/', auth, sauceCtrl.getAllSauces);                  // selection des sauces 

router.get('/:id', auth, sauceCtrl.getOneSauce);                // selection d'une sauce

router.post('/', auth, multer, sauceCtrl.createSauce)           // creation d'une sauces

router.put('/:id', auth, multer, sauceCtrl.modifySauce)         // modification d'une sauces

router.delete('/:id', auth, sauceCtrl.deleteSauce);             // supression d'une sauces

router.post('/:id/like', auth, sauceCtrl.likeSauce);            //like d'une sauces

module.exports = router;