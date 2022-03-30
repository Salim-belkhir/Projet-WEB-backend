const { get } = require('http');
var mysql = require('mysql');
const fs = require('fs')
const path = require('path')


var connectionPool = null;
function getConnection(){
   // console.log("get connection");
   if (!connectionPool){
      // console.log("init connectionPool");
      connectionPool = mysql.createPool({
         connectionLimit: 10,
         host     : 'dokku-mysql-location-bkr',
         user     : 'mysql',
         password : '0156d73fd8bf8fb2',
         database: '/location_bkr',
         port : 3306
      })      
   }
   return connectionPool;
}

fs.readFile(path.resolve(__dirname, "./database.sql"), {encoding: 'utf-8'}, (err, data) => {
    if(err){
        console.error(err)
    } else {
        getConnection().query(data)
    }
})


// ----------------------------------------------------
// ---------- SELECT / Query data
// Requetes de base

exports.queryData = function(request,callback){
   // console.log("query")
   getConnection().query(request,function(err,result){
        if(err) console.log(err);
        callback(result);
    });
}

exports.queryAll = function(table,callback){
    this.queryData(`SELECT * FROM ${table}`, callback);
}

exports.queryAllOrdered = function(table,order,callback){
    this.queryData(`SELECT * FROM ${table} ORDER BY ${order}`, callback);
}

exports.queryValue = function(table,property,key,callback){
    this.queryData(`SELECT * FROM ${table} WHERE ${property}=${key}`, callback);
}

exports.queryValueColumn = function(table,column,property,key,callback){
    this.queryData(`SELECT ${column} FROM ${table} WHERE ${property}=${key}`, callback);
}


exports.queryJoin = function(callback){
    this.queryData(`SELECT * FROM Voiture INNER JOIN Disponibilité ON Voiture.idVoiture = Disponibilité.idVoiture;`, callback);
}

exports.detailsVoiture = function(callback){
    this.queryData(`SELECT * FROM Voiture INNER JOIN Photo ON Voiture.idVoiture = Photo.idVoiture;`, callback);
}

exports.verifyMail = function(mail, callback){
    getConnection().query(`SELECT * FROM Client WHERE mailClient = "${mail}"`, function(err, result){
        if(err) { console.log(err) }
        callback(result);
    })
}


exports.recupPhotos = function(id){
    getConnection().query(`SELECT url FROM Photo WHERE idVoiture = ${id};`, function(result,err){
        if(err) { console.log(err);}
        return result;
    })
}

/*************  REQUETES D'AJOUT  ****************************/


exports.ajoutVoiture = function(marque, modele, idEntreprise, localisation, prixJournalier, type){
        getConnection().query(`Select idType FROM Type WHERE libelléType = "${type}"`,function(err, result){
            if(err){   console.log(err);}
            var idType = result[0].idType;
            getConnection().query(`SELECT MAX(idVoiture) AS id FROM Voiture`,function(err, result){
                if(err){   console.log(err);}
                var idVoiture = result[0].id +1;
                getConnection().query(`INSERT INTO Voiture (idVoiture, Marque, Modèle, Localisation, PrixJournalier, idEntreprise,idTypeVoiture) VALUES ("${idVoiture}","${marque}","${modele}","${localisation}",${prixJournalier}, ${idEntreprise}, ${idType})`, function(err, result){
                    if(err){   console.log(err);}
                    //Après avoir insérer faut ajouter cette voiture aux disponibilités
                    // On décide de prendre comme date de fin un an apres (choix arbitraire)
                    getConnection().query(`INSERT INTO Disponibilité (idVoiture, date_deb, date_fin) VALUES (${idVoiture}, "2022-03-29" , "2023-03-28");`, function(err, result){
                        if(err){ console.log(err)}
                    })
                })
            })
        })
}


exports.ajoutClient = function(nom, prenom, rue, ville, code, mail, numero, password){    
    getConnection().query(`SELECT max(idClient) AS id FROM Client`, function(err,result){
        if(err){  console.log(err);}
        let id = result[0].id + 1;
        getConnection().query(`INSERT INTO Client (idClient, nomClient, prenomClient, RueClient, VilleClient, CPClient, numeroClient, mailClient, password) VALUES (${id},"${nom}","${prenom}","${rue}","${ville}",${code},"${numero}","${mail}","${password}")`,function(err,result){
            if(err){   console.log(err); }
            return
        })
        return
    })
    return
}


exports.ajoutEntreprise = function(nom, rue, ville, code, numero, mail, password){
    getConnection().query(`SELECT MAX(idEntreprise) AS id FROM Entreprise`, function(err, result){
        if(err){ console.log(err)}
        const id = result[0].id +1;
        getConnection().query(`INSERT INTO Entreprise (idEntreprise, nom, rueEntreprise, villeEntreprise, CPEntreprise, numeroEntreprise, mailEntreprise, passwordEntreprise) VALUES (${id}, "${nom}", "${rue}","${ville}",${code},"${numero}","${mail}", "${password}")`, function(err){
            if(err){ console.log(err)}
        })
    })
}


exports.ajoutType = function(libelle){
    getConnection().query(`SELECT MAX(idType) AS id FROM Type`, function(err, result){
        if(err) {console.log(err)}
        const id = result[0].id + 1;
        getConnection().query(`INSERT INTO Type (idType, libelléType) VALUES (${id}, "${libelle}")`, function(err, result){
            if(err){ console.log(err)}
        })
    })
}





//Suppression d'une disponibilité, mise a jour de cette disponibilité 


exports.supDispo = function(id, dateDeb, dateFin){
    getConnection().query(`SELECT * FROM Disponibilité WHERE idVoiture = ${id} AND date_debut <= "${dateDeb}" AND date_fin >= "${dateFin}";`, function(err, result){
        if(err) { console.log(err)}
        let date1 = result[0].date_debut; 
        let date2 = result[0].date_fin;
        //On supprime d'abord cette disponibilité pour pouvoir ajouter les deux nouvelles 
        getConnection().query(`DELETE FROM Disponibilité WHERE idVoiture ${id} AND date_debut = "${date1}" AND date_fin = "${date2}`, function(err, result){
            if(err){ console.log(err)}
            //on ajoute deux lignes, 1)  une avec comme date_deb la date qui était déjà presente, et date_fin la date de la reservation - 1
            //  2) Pour la deuxieme, date_deb vaut la date de fin de la reservation + 1, et date_fin vaut la date de fin qui existait déjà
            getConnection().query(`INSERT INTO Disponibilité (idVoiture, date_debut, date_fin) VALUES (${id}, "${date1}", date_format(date("${dateDeb}")-1, "%Y-%m-%d"));
            INSERT INTO Disponibilité (idVoiture, date_debut, date_fin) VALUES (${id}, "date_format(date("${dateFin}")+1, "%Y-%m-%d")", "${date2}");`, function(err, result){
                if(err){ console.log(err)}
            })
        })
    })
}







exports.ajoutReservation = function(idVoiture, idClient, dateDeb, dateFin, prixTotal){
    //quand on ajoute une réservation, il faut aussi enlever les disponibilités de cette voiture
    getConnection().query(`SELECT MAX(idReservation) AS id FROM Réservation`, function(err, result){
        if(err){ console.log(err)}
        const id = result[0].id + 1;
        getConnection().query(`INSERT INTO Réservation (idReservation, idVoiture, idClient, date_debut, date_fin, prix) VALUES (${id},${idVoiture}, ${idClient}, "${dateDeb}", "${dateFin}", ${prixTotal});`,function(err, result){
            if(err){ console.log(err)}
        })
        //On met a jour les disponibilités de la voiture comme elle est réservée
        getConnection().query(`SELECT * FROM Disponibilité WHERE idVoiture = ${id} AND date_debut <= "${dateDeb}" AND date_fin >= "${dateFin}";`, function(err, result){
            if(err) { console.log(err)}
            console.log(result)
            let date1 = result[0].date_debut; 
            let date2 = result[0].date_fin;
            //On supprime d'abord cette disponibilité pour pouvoir ajouter les deux nouvelles 
            getConnection().query(`DELETE FROM Disponibilité WHERE idVoiture ${id} AND date_debut = "${date1}" AND date_fin = "${date2}`, function(err, result){
                if(err){ console.log(err)}
                //on ajoute deux lignes, 1)  une avec comme date_deb la date qui était déjà presente, et date_fin la date de la reservation - 1
                //  2) Pour la deuxieme, date_deb vaut la date de fin de la reservation + 1, et date_fin vaut la date de fin qui existait déjà
                getConnection().query(`INSERT INTO Disponibilité (idVoiture, date_debut, date_fin) VALUES (${id}, "${date1}", date_format(date("${dateDeb}")-1, "%Y-%m-%d"));
                INSERT INTO Disponibilité (idVoiture, date_debut, date_fin) VALUES (${id}, "date_format(date("${dateFin}")+1, "%Y-%m-%d")", "${date2}");`, function(err, result){
                    if(err){ console.log(err)}
                })
            })
        })
    })
}



exports.ajoutAvis = function(idReservation, etoiles, commentaire){
    getConnection().query(`INSERT INTO Avis (idReservation, etoiles, commentaire) VALUES (${idReservation}, ${etoiles}, "${commentaire}")`, function(err){
        if(err) { console.log(err) }
    })
}


// Les disponibilités

exports.dispoSansPrixAvecType = function(localisation, dateDeb, dateFin, type, callback){
    getConnection().query(`SELECT * FROM Disponibilité INNER JOIN Voiture ON Disponibilité.idVoiture = Voiture.idVoiture INNER JOIN Type ON Type.idType = Voiture.idTypeVoiture WHERE Disponibilité.date_debut <= "${dateDeb}" AND Disponibilité.date_fin >= "${dateFin}" AND Voiture.Localisation = "${localisation}" AND Type.libelléType = "${type}";`, function(err, result){
        if(err){ console.log(err);}
        callback(result);
    })
}

exports.dispoSansPrixSansType = function(localisation, dateDeb, dateFin, callback){
    getConnection().query(`SELECT * FROM Disponibilité INNER JOIN Voiture ON Disponibilité.idVoiture = Voiture.idVoiture INNER JOIN Type ON Type.idType = Voiture.idTypeVoiture WHERE Disponibilité.date_debut <= "${dateDeb}" AND Disponibilité.date_fin >= "${dateFin}" AND Voiture.Localisation = "${localisation}";`, function(err, result){
        if(err){ console.log(err);}
        console.log(result)
        callback(result);
    })
}   

exports.dispoAvecPrixSansType = function(localisation, dateDeb, dateFin, prixMax, callback){
    getConnection().query(`SELECT * FROM Disponibilité INNER JOIN Voiture ON Disponibilité.idVoiture = Voiture.idVoiture INNER JOIN Type ON Type.idType = Voiture.idTypeVoiture WHERE Disponibilité.date_debut <= "${dateDeb}" AND Disponibilité.date_fin >= "${dateFin}" AND Voiture.Localisation = "${localisation}" AND Voiture.PrixJournalier <= ${prixMax};`, function(err, result){
        if(err){ console.log(err);}
        callback(result);  
    })
}

exports.dispoAvecPrixAvecType = function(localisation, dateDeb, dateFin, prixMax, type, callback){
    getConnection().query(`SELECT * FROM Disponibilité INNER JOIN Voiture ON Disponibilité.idVoiture = Voiture.idVoiture INNER JOIN Type ON Type.idType = Voiture.idTypeVoiture WHERE Disponibilité.date_debut <= "${dateDeb}" AND Disponibilité.date_fin >= "${dateFin}" AND Voiture.Localisation = "${localisation}" AND Voiture.PrixJournalier <= ${prixMax} AND Type.libelléType = "${type}";`, function(err, result){
        if(err){ console.log(err);}
        callback(result);
    })
}


//********************************** */


/**********   Suppression *************/


//Suppression d'un client

exports.supClient = function(id){
    //Avant de supprimer le client, dans la tablle "Réservation" , il faut changer les informations liés à l'id client(je les mets à 'null' pour ne pas avoir à les supprimer) car il n'existera plus
    getConnection().query(`UPDATE Réservation SET idClient = NULL WHERE idClient = ${id} `, function(err, result){
        if(err){ console.log(err)}
        getConnection().query(`DELETE FROM Client WHERE idClient = ${id};`, function(err, result){
            if(err){ console.log(err);}
        })

    })
}

//suppression d'une Entreprise

exports.supEntreprise = function(id){
    //Quand une entreprise efface son compte, il faut effacer toutes les voitures qu'elle propose. 
    //Pour pouvoir supprimer la voiture, il faut supprimer toutes les réservations, avis et disponibilités liés à cette voiture.
    getConnection().query(`SELECT idVoiture FROM Voiture WHERE idEntreprise = ${id};`, function(err, result){
        //Je récupère d'abord la liste des voitures que l'entreprise possède
        if(err) {console.log(err)}
        let nombre = result.length; //Je récupère le nombre de voitures
        for(let i =0; i<nombre; i++){
            let j = result[i];
            //Pour chaque voiture, je vais récuperer la liste des réservations à laquelle elle est attachée, pour pouvoir supprimer tous les avis liés
            getConnection().query(`SELECT idReservation FROM Réservation WHERE idVoiture = ${j};`, function(err, result){
                if(err) { console.log(err)}
                let taille2 = result.length; //le nombre de réservartions qui existent pour la voiture
                for (let n; n<taille2; n++){
                    let m = result[n];
                    // je supprime toutes les avis
                    getConnection().query(`DELETE FROM Avis WHERE idReservation = ${m};`, function(err){ //Je supprim
                        if(err){ console.log(err)}
                    })
                }
            });
            //je peux ensuite supprimer la liste des réservations 
            getConnection().query(`DELETE FROM Réservation WHERE idVoiture = ${j};`, function(err){
                if(err){ console.log(err);}
            })
        }
    });
    //je peux donc supprimer toutes les voitures proposées par cette entreprise
    getConnection().query(`DELETE FROM Voiture WHERE idEntreprise = ${id};`, function(err){
        if(err) {console.log(err)}
    });
    //Pour finir, je peux supprimer l'entreprise
    getConnection().query(`DELETE FROM Entreprise WHERE idEntreprise = ${id};`, function(err){
        if(err){console.log(err);}
    })
}








//Suppression d'une voiture

exports.supVoiture = function(id){
    //on efface d'abord cette voiture des réservations pour éviter une incohérence de clés etrangeres 
    getConnection().query(`DELETE FROM Réservation WHERE idVoiture = ${id};`, function(err, result){
        if(err){ console.log(err)}
        getConnection().query(`DELETE FROM Disponibilité WHERE idVoiture = ${id};`, function(err){
            if(err){ console.log(err)}
        })
        getConnection().query(`DELETE FROM Voiture WHERE idVoiture = ${id}`, function(err){
            if(err){ console.log(err)}
        })
    })
}

//Suppression d'un avis

exports.supAvis = function(id){
    getConnection().query(`DELETE FROM Avis WHERE idReservation = ${id};`, function(err){
        if(err){  console.log(err)}
    })
}


//Suppression d'une reservation


exports.supReservation = function(id){
    //On supprime d'abord tout avis possibles qui ont pu exister
    this.supAvis(id);
    getConnection().query(`DELETE FROM Réservation WHERE idReservation = ${id};`)
}


/*********** MISE A JOUR **********/



//Update informations d'un client
exports.majClient = function(id, nom, prenom, rue, ville, CP, numero, mail){
    if(nom != ""){
        getConnection().query(`UPDATE Client SET nomClient = ${nom} WHERE idClient = ${id};`, function(err){
            if(err) {console.log(err)}
        })
    }
    if(prenom != ""){
        getConnection().query(`UPDATE Client SET prenomClient = ${prenom} WHERE idClient = ${id};`, function(err){
            if(err) {console.log(err)}
        })
    }
    if(rue != ""){
        getConnection().query(`UPDATE Client SET RueClient = ${rue} WHERE idClient = ${id};`, function(err){
            if(err) {console.log(err)}
        })
    }
    if(ville != ""){
        getConnection().query(`UPDATE Client SET VilleClient = ${ville} WHERE idClient = ${id};`, function(err){
            if(err) {console.log(err)}
        })
    }
    if(nom != ""){
        getConnection().query(`UPDATE Client SET CPClient = ${CP} WHERE idClient = ${id};`, function(err){
            if(err) {console.log(err)}
        })
    }
    if(nom != ""){
        getConnection().query(`UPDATE Client SET numeroClient = ${numero} WHERE idClient = ${id};`, function(err){
            if(err) {console.log(err)}
        })
    }
    if(mail != ""){
        getConnection().query(`UPDATE Client SET mailClient = ${mail} WHERE idClient = ${id};`, function(err){
            if(err) {console.log(err)}
        })
    }
}


//update infos Entreprise


exports.majSociety = function(id, nom, rue, ville, CP, numero, mail, password){
    if(nom != ""){
        getConnection().query(`UPDATE Entreprise SET nom = "${nom}" WHERE idEntreprise = ${id};`, function(err){
            if(err) {console.log(err)}
        })
    }
    if(rue != ""){
        getConnection().query(`UPDATE Entreprise SET RueEntreprise = "${rue}" WHERE idEntreprise = ${id};`, function(err){
            if(err) {console.log(err)}
        })
    }
    if(ville != ""){
        getConnection().query(`UPDATE Entreprise SET VilleEntreprise = "${ville}" WHERE idEntreprise = ${id};`, function(err){
            if(err) {console.log(err)}
        })
    }
    if(CP != null){
        getConnection().query(`UPDATE Entreprise SET CPEntreprise = ${CP} WHERE idEntreprise = ${id};`, function(err){
            if(err) {console.log(err)}
        })
    }
    if(nom != ""){
        getConnection().query(`UPDATE Entreprise SET numeroEntreprise = "${numero}" WHERE idEntreprise = ${id};`, function(err){
            if(err) {console.log(err)}
        })
    }
    if(mail != ""){
        getConnection().query(`UPDATE Entreprise SET mailEntreprise = "${mail}" WHERE idEntreprise = ${id};`, function(err){
            if(err) {console.log(err)}
        })
    }
    if(password != ""){
        getConnection().query(`UPDATE Entreprise SET passwordEntreprise = "${password}" WHERE idEntreprise = ${id}`, function(err){
            if(err) { console.log(err)}
        })
    }
}



//mise a jour d'une voiture


exports.majCar = function(id, marque, modele, localisation, prix, type){
    if(marque != ""){
        getConnection().query(`UPDATE Voiture SET Marque = "${marque}" WHERE idVoiture = ${id};`, function(err){
            if(err) {console.log(err)}
        })
    }
    if(modele != ""){
        getConnection().query(`UPDATE Voiture SET Modèle = "${modele}" WHERE idVoiture = ${id};`, function(err){
            if(err) {console.log(err)}
        })
    }
    if(localisation != ""){
        getConnection().query(`UPDATE Voiture SET Localisation = "${localisation}" WHERE idVoiture = ${id};`, function(err){
            if(err) {console.log(err)}
        })
    }
    if(prix != null){
        getConnection().query(`UPDATE Voiture SET PrixJournalier = ${prix} WHERE idVoiture = ${id};`, function(err){
            if(err) {console.log(err)}
        })
    }
    if(type != ""){
        getConnection().query(`UPDATE Voiture SET idTypeVoiture = ${type} WHERE idVoiture = ${id};`, function(err){
            if(err) { console.log(err)}
        })
    }
}



exports.trouverAvis = function(id, callback){
    getConnection().query(`SELECT * FROM Avis INNER JOIN Réservation ON Avis.idReservation = Réservation.idReservation WHERE Réservation.idVoiture = ${id};`, function(err, result){
        if(err){ console.log(err); return;}
        callback(result)
    })
}






//connection.end();