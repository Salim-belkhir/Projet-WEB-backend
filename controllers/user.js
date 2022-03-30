const db = require('../models/database')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


exports.signupClient = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            db.ajoutClient(req.body.nom, req.body.prenom, req.body.rue, req.body.ville, req.body.code, req.body.mail, req.body.numero, hash)
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
};

exports.loginClient = (req, res, next) => {
    db.queryValue('Client', 'mailClient', `"${req.body.email}"`, function(result){
        if(result.length == 0){
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, result[0].password)
        .then(valid => {
            if(!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({ 
                userId : result[0].idClient,
                token : jwt.sign(
                    {userId : result[0].idClient},
                    'RANDOM_TOKEN_SECRET',
                    {expiresIn: '24h'}
                )
            });  
        })
        .catch(error => res.status(500).json({ error }));
    })
};





exports.signupSociety = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            db.ajoutEntreprise(req.body.nom, req.body.rue, req.body.ville, req.body.code, req.body.numero, req.body.mail, hash)
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
};



exports.loginSociety = (req, res, next) => {
    db.queryValue('Entreprise', 'mailEntreprise', `"${req.body.email}"`, function(result){
        result = JSON.parse(JSON.stringify(result));
        if(result.length == 0){
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, result[0].passwordEntreprise)
        .then(valid => {
            if(!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
                userId : result[0].idEntreprise,
                token : jwt.sign(
                    {userId : result[0].idEntreprise},
                    'RANDOM_TOKEN_SECRET',
                    {expiresIn: '24h'}
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
};