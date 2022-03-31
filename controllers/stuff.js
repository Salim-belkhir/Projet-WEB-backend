const db = require('../models/database');
const bcrypt = require('bcrypt');


exports.getCars = function(req,res){
    /*db.queryAll('Voiture',function(result){  //on récupére le tableau de voitures existantes qu'on renvoie directement au frontend
        /*let tab = []
        for(let i = 0; i<result.length; i++){
            var car = { 
                idVoiture : result[i].idVoiture, 
                Marque : result[i].Marque, 
                Modèle : result[i].Modèle, 
                Localisation : result[i].Localisation, 
                PrixJournalier : result[i].PrixJournalier, 
                idEntreprise : result[i].idEntreprise, 
                idTypeVoiture : result[i].idTypeVoiture, 
                images : [] 
            }
            //var photos = db.recupPhotos(car.idVoiture)
            //console.log(photos);
            //let results=JSON.parse(JSON.stringify(photos));
            //console.log(results);
            var test = db.queryValueColumn('Photo','url', 'idVoiture', `${car.idVoiture}`, function(res){
                //console.log(res);
                let photos = []
                let results=JSON.parse(JSON.stringify(res));
                //console.log(results)
                for(let j = 0; j < results.length; j++){
                    //console.log(res[i])
                    //car.images.push(results[i].url)
                    //console.log(results[j].url)
                    photos.push(results[j])
                }
                return photos
                //console.log(car.images)
            })
            console.log(test)
            
            //console.log(car.images)
            tab.push(car);*/
        //res.send(tab).status(200);
        /*res.send(result)
    })*/
    db.detailsVoiture(function(result){
        res.send(result)
    })
};

exports.getCar = function(req, res){
    const id = req.params['id'];
    //db.queryValue('Voiture', 'idVoiture', id, function(result){
      //  res.send(result).status(200);
    //})
    db.voituredetail(id, function(result){
        res.send(result).status(200);
    })
}


exports.addCar = function(req,res){
    // on fait l'appel de cette fonction définie dans database.js qui va ajouter à la base de données
    db.ajoutVoiture(req.body.marque,req.body.modele, req.body.idEntreprise, req.body.localisation, req.body.prixJournalier, req.body.type);
    res.send("Ajouté").status(201);
};

exports.updateCar = function(req, res){
    const id = req.params.id;
    let marque = req.body.marque;
    let modele = req.body.modele;
    let localisation = req.body.localisation;
    let prix = req.body.prixJournalier; 
    let entreprise = req.body.idEntreprise;
    let type = req.body.type;
    db.majCar(id, marque, modele, localisation, prix, entreprise, type);
    res.status(200).send("Mise à jour réussie");
}

exports.deleteCar = function(req, res){
    const id = req.params['id'];
    console.log("Je fais de mon maximum pour supprimer")
    db.queryValueColumn('Voiture', 'idEntreprise', 'idVoiture', `${id}`, function(result){
        /*if(result[0] != req.auth.userId){
            res.status(400).json({
                error : new Error('Unauthorized request!')
            });
        }*/
    })
    if(db.supVoiture(id)){
        res.send("Voiture supprimée").status(200);
    }
    else{
        res.status(404).json({error: new Error('No such Car')});
    }
}

/******* Entreprise *****************/

exports.getSocieties = function(req,res,next){
    db.queryAll('Entreprise', function(result){
        res.status(200).send(result);
    })
};


exports.getSociety = function(req, res){
    console.log(req.params)
    const id = req.params['id'];
    db.queryValue('Entreprise', 'idEntreprise', id, function(result){
        res.send(result).status(200);
    })
};

exports.addSociety = function(req, res){
    let nom = req.body.nom;
    let rue = req.body.rue;
    let ville = req.body.ville; 
    let code = req.body.code;
    let mail = req.body.mail;
    let numero = req.body.numero;
    db.ajoutEntreprise(nom, rue, ville, code, numero, mail);
    res.send("La société a été ajouté").status(201);
};


exports.deleteSociety = function(req, res){
    const id = req.params['id'];
    if( id != req.auth.userId){
        res.status(400).json({
            error : new Error('Unauthorized request!')
        });
    }
    db.supEntreprise(id);
    //fonction définie dans database.js
    res.status(200);
};

exports.getCarsOfSociety = function(req, res){
    const id = req.params['id'];
    db.queryValue('Voiture', 'idEntreprise', id, function(result){
        res.send(result).status(200);
    })
};

exports.updateSociety = function(req, res){
    console.log(req.body)
    const id = req.params['id'];
    let nom = req.body.nom;
    let rue = req.body.rue;
    let ville = req.body.ville; 
    let code = req.body.code;
    let mail = req.body.mail;
    let numero = req.body.numero;
    let password = req.body.password;
    db.majSociety(id, nom, rue, ville, code, numero, mail, password);
    res.send(201);
};



/***** CLIENTS *********/

exports.getAllClients = function(req, res){
    db.queryAll('Client', function(result){
        res.status(200).send(result);
    })
};

exports.getClient =  function(req, res){
    const id = req.params['id'];
    db.queryValue('Client', 'idClient', id, function(result){
        res.status(200).send(result);
    })
};

exports.addClient =  function(req, res){
    // on récupère les informations dans le body pour pouvoir ajouter l'élément a la base de données
    let nom = req.body.nom;
    let prenom = req.body.prenom;
    let rue = req.body.rue;
    let ville = req.body.ville; 
    let code = req.body.code;
    let mail = req.body.mail;
    let numero = req.body.numero;
    let password = req.body.password;
    console.log(req.body)
    db.ajoutClient(nom,prenom, rue,ville,code,mail,numero, password); //fonction définie dans "database.js"
    res.status(201).send("Ajouté");
};


exports.deleteClient = function(req, res){
    const id = req.params['id'];
    if( id != req.auth.userId){
        res.status(400).json({
            error : new Error('Unauthorized request!')
        });
    }
    db.supClient(id);
    res.send(200);
};

exports.updateClient = function(req, res){
    console.log(req.body)
    const id = req.params['id'];
    let nom = req.body.nom;
    let prenom = req.body.prenom;
    let rue = req.body.rue;
    let ville = req.body.ville; 
    let code = req.body.code;
    let mail = req.body.mail;
    let numero = req.body.numero;
    let password = req.body.password;
    db.majClient(id, nom, prenom, rue, ville, code, mail, numero, password);
    res.status(200)
}


/*********************/

exports.getDispo = function(req, res){
    db.queryAll('Disponibilité', function(result){
        for(let i =0; i< result.length; i++){
            let dateDeb = new Date();
            let dateFin = new Date();
            dateDeb = result[i].date_debut;
            dateFin = result[i].date_fin;
            const formatDate = (date) => {
                let formatted_date = date.getDate()  + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
                return formatted_date;
            } 
            result[i].date_debut = formatDate(dateDeb);
            result[i].date_fin = formatDate(dateFin);
        }
        res.send(result);
    })
}


exports.findDispo = function(req, res){
    let localisation = req.body.localisation;
    let dateDeb = req.body.dateDeb; 
    let dateFin = req.body.dateFin;
    /*console.log(dateDeb)
    let Date1 = dateDeb.split("-");
    let dateDebut = Date1[2]+"-"+Date1[3]+"-"+Date1[4];
    let Date2 = dateFin.split("-");
    let dateFinal = Date2[2]+"-"+Date2[3]+"-"+Date2[4];*/
    let prixMax = req.body.prixMax;
    let type = req.body.type;
    if(type == "" && prixMax == null){
        db.dispoSansPrixSansType(localisation, `${dateDeb}`, `${dateFin}`, function(result){
            console.log(result)
            res.send(result).status(200);
            return;     
        });
    }
    if(type != "" && prixMax != null){
        db.dispoAvecPrixAvecType(localisation, dateDeb, dateFin, prixMax, type, function(result){
            res.send(result).status(200);
            console.log(result)
            return;
        })   
    }
    if( type == "" && prixMax != null){
        db.dispoAvecPrixSansType(localisation, dateDeb, dateFin, prixMax, function(result){
            res.send(result).status(200);
            console.log(result)
            return;
        })
    }
    if( type != "" && prixMax == null){
        db.dispoSansPrixAvecType(localisation, dateDeb, dateFin, type, function(result){
            res.status(200).send(result);
            console.log(result)
            return;
        })
    }

}


/*
exports.findDispo = function(req, res){
    console.log(req.body.dateDeb);
    let localisation = req.body.localisation;
    let dateDeb = req.body.dateDeb;
    let dateFin = req.body.dateFin;
    let prixMax = req.body.prixMax;
    db.queryJoin(function(result){
        let resultat = [];
        for(let i =0; i< result.length; i++){
            console.log(result[i].date_debut[4])
            let dateDeb2 = new Date();
            let dateFin2 = new Date();
            dateDeb = result[i].date_debut;
            dateFin = result[i].date_fin;
            const formatDate = (date) => {
                let formatted_date = date.getDate()  + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
                return formatted_date;
            } 
            
            result[i].date_debut = formatDate(dateDeb2);
            result[i].date_fin = formatDate(dateFin2);
            console.log(formatDate(result[i].date_debut))
            if(prixMax == null){
                if( dateDeb >= result[i].date_debut && dateFin <= result[i].date_fin && localisation == result[i].localisation){
                    resultat.push(result[i]);
                }
            }
            else{
                if(dateDeb >= result[i].date_debut && dateFin <= result[i].date_fin && localisation == result[i].localisation && prixMax >= result[i].prixMax){
                    resultat.push(result[i])
                }
            }
        } 
        res.send(result);
    })
};*/

exports.getTypesName = function(req, res){
    db.queryAll('Type', function(result){
        res.send(result);
    })
};

exports.getType = function(req, res){
    const id = req.params['id'];
    db.queryValue('Type', 'idType', id, function(result){
        res.send(result);
    })
}

exports.addType = function(req, res){
    db.ajoutType(req.body.libelle);
    res.status(200).send("Type ajouté!");
}


exports.getPhotos = function(req, res){
    const id = req.params.id;
    db.queryValue('Photo', 'idVoiture', id, function(result){
        res.send(result);
    })
}


exports.getReservation = function(req, res){
    db.queryAll('Réservation', function(result){
        res.status(200).send(result)
    })
}


exports.getReservationsClient = function(req, res){
    const id = req.params.id;
    db.queryValue('Réservation', 'idClient', id, function(result){
        res.status(200).send(result)
    })
}


exports.getReservationsCar = function(req, res){
    const id = req.params.id;
    db.queryValue('Réservation', 'idVoiture', id, function(result){
        res.status(200).send(result);
    })    
}


exports.addReservation = function(req, res){
    db.ajoutReservation(req.body.idVoiture, req.body.idClient, req.body.dateDeb, req.body.dateFin, req.body.prixTotal);
}


exports.updateReservation = function(req, res){

};

exports.deleteReservation = function(req, res){
    const id = req.params.id;
    db.supReservation(id);
    res.status(200);
};  


//Avis


exports.getAllRates = function(req, res){
    db.trouverAvis(req.params.id, function(result){
        console.log(result)
        res.status(200).send(result);
    });
}