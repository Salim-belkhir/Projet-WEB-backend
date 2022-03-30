const express = require('express');

const router = express.Router();

const auth = require('../mddleware/auth');

const stuffCtrl = require('../controllers/stuff');

router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


////////////   VOITURES   ////////////////////


//avoir toutes les voitures (GET)
router.get('/cars', stuffCtrl.getCars);

//avoir une voiture en particulier  (GET)
router.get('/cars/:id', stuffCtrl.getCar);

//Ajouter une voiture  (POST)
router.post('/cars', stuffCtrl.addCar);

//Mettre à jour les informations d'une voiture (UPDATE)
router.put('/cars/:id', auth, stuffCtrl.updateCar);

//supprimer une voiture
router.delete('/cars/:id', stuffCtrl.deleteCar);







////////////////   ENTREPRISES    //////////////////

//avoir toutes les entreprises (GET)
router.get('/societies', stuffCtrl.getSocieties);

//avoir une entreprise en particulier (GET)
router.get('/societies/:id', stuffCtrl.getSociety);

//ajouter une entreprise (POST)
router.post('/societies', stuffCtrl.addSociety);

// Suppression d'une entreprise (DELETE)
router.delete('/societies/:id', stuffCtrl.deleteSociety);


//Listes de voitures d'une entreprises 
router.get('/societies/:id/cars', stuffCtrl.getCarsOfSociety);

//mise a jour des infos de l'entreprise (UPDATE)
router.put('/societies/:id', stuffCtrl.updateSociety)





/////////    CLIENTS    /////////////

// liste des Clients (GET)
router.get('/clients', stuffCtrl.getAllClients);

//informations d'un client en particulier   (GET)
router.get('/clients/:id', stuffCtrl.getClient);

//ajout d'un client (CREATE)
router.post('/clients', stuffCtrl.addClient);


//Supprimer le compte d'un client  (DELETE)
router.delete('/clients/:id', stuffCtrl.deleteClient);

//mise à jour des infos d'un client  (PUT)
router.patch('/clients/:id', stuffCtrl.updateClient)

//liste des réservations de voitures d'un client
//router.get('/clients/reservation', stuffCtrl)



// Recherche d'une voiture
    //trouver une voiture en fonction de la disponilité
router.post('/cars/disponibilities', stuffCtrl.findDispo);

router.get('/disponibilities', stuffCtrl.getDispo)



//////// TYPE DE VOITURES  ////

// Récupération de la liste des types de voitures à utiliser dans l'ajout d'une voiture par une entreprise
router.get('/types', stuffCtrl.getTypesName);

//recuperation d'un type de voiture par l'identifiant
router.get('/types/:id', stuffCtrl.getType);


//ajouter un type de voiture
router.post('/types',stuffCtrl.addType);


router.get('/photos/:id', stuffCtrl.getPhotos);



// Réservation

router.get('/reservations', stuffCtrl.getReservation);



//A partir d'un client, on récupère toutes ses réservations
router.get('/reservations/client/:id', stuffCtrl.getReservationsClient);

//A partir d'une voiture, récupérer la liste des réservations faites pour une voiture
router.get('/reservations/cars/:id', stuffCtrl.getReservationsCar);



//Ajouter une réservation
router.post('/reservations', function(req, res){
    stuffCtrl.addReservation(req,res);
});

router.patch('/reservations/:id', function(req, res) {
    stuffCtrl.updateReservation(req,res);
});


router.delete('/reservations/:id', function(req, res){
    stuffCtrl.deleteReservation(req,res);
});


router.get('/rates/:id', function(req, res){
    stuffCtrl.getAllRates(req, res);
});



module.exports = router;