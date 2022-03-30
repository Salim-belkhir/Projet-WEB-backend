const { get } = require('http');
var mysql = require('mysql2');
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
         database: 'location_bkr',
         port : 3306
      })      
   }
   return connectionPool;
}

getConnection().query(`-- phpMyAdmin SQL Dump -- version 5.1.1 -- https://www.phpmyadmin.net/ -- -- Hôte : localhost -- Généré le : mer. 30 mars 2022 à 17:28 -- Version du serveur : 10.4.22-MariaDB -- Version de PHP : 8.1.2 SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO"; START TRANSACTION; SET time_zone = "+00:00"; /*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */; /*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */; /*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */; /*!40101 SET NAMES utf8mb4 */; -- -- Base de données : database2 -- -- -------------------------------------------------------- -- -- Structure de la table Avis -- CREATE TABLE IF NOT EXISTS Avis( idReservation int(3) NOT NULL, etoiles int(1) NOT NULL, commentaire text NOT NULL, PRIMARY KEY (idReservation)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; -- -- Déchargement des données de la table Avis -- INSERT INTO Avis (idReservation, etoiles, commentaire) VALUES (1, 5, 'Voiture agréable, personnel sympa'), (2, 1, 'Je n\'ai pas trop aimé l\'accueil, la voiture était sale'); -- -------------------------------------------------------- -- -- Structure de la table Client -- CREATE TABLE IF NOT EXISTS Client ( idClient int(3) NOT NULL, nomClient varchar(30) NOT NULL, prenomClient varchar(30) NOT NULL, RueClient varchar(30) NOT NULL, VilleClient varchar(30) NOT NULL, CPClient int(5) NOT NULL, numeroClient varchar(10) NOT NULL, mailClient varchar(50) NOT NULL, password varchar(100) NOT NULL, PRIMARY KEY (idClient), UNIQUE KEY mailClient (mailClient) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; -- -- Déchargement des données de la table Client -- INSERT INTO Client (idClient, nomClient, prenomClient, RueClient, VilleClient, CPClient, numeroClient, mailClient, password) VALUES (1, 'Dupont', 'Marcel', '1 impasse de Barthelemy', 'Grenier', 41233, '0262173320', 'marcel14@leblanc.fr', ''), (2, 'Olivier', 'Adam', '54, rue Mercier', 'Perrot-sur-Noel', 99247, '0357706757', 'ada@service-client.com', ''), (3, 'Andrée', 'Jacques', '974, rue Aimée Morel', 'Rey-la-Forêt', 32412, '0173864312', 'genevieve37@dufour.org', ''), (4, 'Chapelier', 'Philippe', '5 Rue Eugène Bataillon', 'Montpellier', 340000, '0908080810', 'philippe@umontpellier.fr', 'polytech'), (5, 'jdjdjjdjd', 'jdjjddjjdjd', 'jjdjdjdjkkskks', 'Montpellier', 56777, 'jdjjdjdjdj', 'eejejejeje', 'jdjjdjdjdj'), (6, 'djjdjddjd', 'jdjjdjdjd', 'ndndnndnd', 'nndndndn', 67899, '0909090909', 'nndndndnd', 'jdjdjjdjdj'), (7, 'kskksksksks', 'kskskksks', 'kskksksks', 'kskksksks', 56000, 'kkskskskks', ',s,,s,s,s', 'kskskskksks'), (8, 'jdjdjdjdj', 'jjdjdjdj', 'jdjjdjdjdjd', 'jdjjdjdjdjd', 45000, 'jjdjdjdjdj', 'ujdujssjsj', '$2b$10$lY4Wcs4ub19DvIw8KK1Km.aev0oj8OKalmFhtPHuBEcBKkOAeqa2y'), (9, 'Jean-Louis', 'Ahmed', 'Avenue de ruen', 'Toulouse', 34000, '0909090909', 'april@hheheh.com', '$2b$10$GpjrYiQuXDF94lWcI9dU1OAsPkH/AyWdxI5eN9.ezB/YrhaYtFoAC'), (10, 'Hamid', 'Dupont', '6 Rue des Hospices', 'Montpellier', 35000, '0788888888', 'hamid@gmail.com', '$2b$10$R0XSnr7NyoD.Tun.lqkZHeWtzoTe9Jc6dDjgSfCV02yCwcEy.pi6e'), (11, 'Train', 'Train', '4 Avenue des Trains', 'Montpellier', 35000, '0677777777', 'train@gmail.com', '$2b$10$H/LT47delxJ0cIOye0A.wuGXVZeRLupB9vPw/GlENkDcaBwH6c4uW'); -- -------------------------------------------------------- -- -- Structure de la table Disponibilité -- CREATE TABLE IF NOT EXISTS Disponibilité ( idVoiture int(3) NOT NULL, date_debut date NOT NULL, date_fin date NOT NULL, PRIMARY KEY (idVoiture,date_debut) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; -- -- Déchargement des données de la table Disponibilité -- INSERT INTO Disponibilité (idVoiture, date_debut, date_fin) VALUES (1, '2022-03-28', '2022-06-30'), (4, '2022-03-28', '2022-03-28'); -- -------------------------------------------------------- -- -- Structure de la table Entreprise -- CREATE TABLE IF NOT EXISTS Entreprise ( idEntreprise int(3) NOT NULL, nom varchar(30) NOT NULL, rueEntreprise varchar(30) NOT NULL, villeEntreprise varchar(30) NOT NULL, CPEntreprise int(5) NOT NULL, numeroEntreprise varchar(10) NOT NULL, mailEntreprise varchar(50) NOT NULL, passwordEntreprise varchar(100) NOT NULL, PRIMARY KEY (idEntreprise), UNIQUE KEY mailEntreprise (mailEntreprise) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; -- -- Déchargement des données de la table Entreprise -- INSERT INTO Entreprise (idEntreprise, nom, rueEntreprise, villeEntreprise, CPEntreprise, numeroEntreprise, mailEntreprise, passwordEntreprise) VALUES (2, 'Ada', '78 Boulevard des Champs', 'Paris', 93000, '0987674423', 'ada@service-client.com', ''), (3, 'Highland Locat', '9 Rue des Catalpas', 'Montpellier', 34090, '0987677123', 'highland@service-client.com', ''), (4, 'undefined', 'undefined', 'undefined', 34000, 'undefined', 'undefined', 'undefined'), (6, 'Sunbelt Location', '9 Rue des Catalpas', 'Montpellier', 34090, '0987677123', 'sunbelt@service-client.com', ''); -- -------------------------------------------------------- -- -- Structure de la table Photo -- CREATE TABLE IF NOT EXISTS Photo ( idVoiture int(11) NOT NULL, url varchar(200) NOT NULL, PRIMARY KEY (idVoiture,url) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; -- -- Déchargement des données de la table Photo -- INSERT INTO Photo (idVoiture, url) VALUES (1, 'https://www.largus.fr/images/images/match-peugeot-308-2021-vs-mercedes-classe-a-21.jpg'), (1, 'https://www.largus.fr/images/images/mercedes-classe-a-18_1.jpg'), (4, 'https://americarprestige.com/wp-content/uploads/2019/07/location-mercedes-classe-v-vip-1.jpg'), (4, 'https://www.levtcdu17.com/wp-content/uploads/2021/07/mercedesbenzutilitaires_20v250davntgrdl2mv3fb_noirobsidiennemetallise-1.png'), (4, 'https://www.van-away.com/wp-content/uploads/2019/07/MINIBUS_VAN-AWAY_2019_720x600px-e1566207789836.jpg'), (5, 'https://www.ajiauto.com/wp-content/uploads/2021/12/bmw-serie-1-2021-prix-maroc.jpg1_.jpg'), (5, 'https://www.automobile-magazine.fr/asset/cms/164404/config/113256/malgre-ses-roues-avant-motrices-cette-serie-1-2019-dispose-dun-chassis-encore-plus-sportif-que-sa-devanciere.jpg'), (5, 'https://www.largus.fr/images/images/bmw-serie-1-2019-29.jpg'), (6, 'https://cdn.motor1.com/images/mgl/EyBbN/s3/bmw-m2-cs-2020.webp'), (6, 'https://www.asphalte.ch/news/wp-content/uploads/2019/11/BMW-M2-F87-CS-750-750x375.jpg'), (6, 'https://www.motorsinside.com/images/photo/article/f12020/c-motorsinside-essais-bmw-m2-2020-08.jpg'), (7, 'https://i0.wp.com/motorsactu.com/wp-content/uploads/2021/10/tw_b009_stepway_78arr_orangeatakama_embargo_20200929_6h.jpeg?fit=1200%2C675&ssl=1'), (7, 'https://img4.autodeclics.com/photo_article/93169/32116/1200-L-dacia-sandero-stepway-2021-les-prix-de-la-baroudeuse.jpg'), (7, 'https://www.automobile-magazine.fr/asset/cms/176416/config/125159/am-dacia-sandero-stepway-1.jpg'), (8, 'https://www.citroen.fr/content/dam/citroen/master/b2c/models/new-c4-e/visualizer/front-view/New%20E-C4%20and%20C4_0MP00NWP_Blanc%20Banquise_FR_1280_720.png'); -- -------------------------------------------------------- -- -- Structure de la table Réservation -- CREATE TABLE IF NOT EXISTS Réservation ( idReservation int(3) NOT NULL, idVoiture int(3) NOT NULL, idClient int(3) NOT NULL, date_debut date NOT NULL, date_fin date NOT NULL, prixTotal int(5) NOT NULL, PRIMARY KEY (idReservation) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; -- -- Déchargement des données de la table Réservation -- INSERT INTO Réservation (idReservation, idVoiture, idClient, date_debut, date_fin, prixTotal) VALUES (1, 1, 2, '2022-05-22', '2022-06-03', 350), (2, 7, 10, '2022-03-28', '2022-04-13', 250), (3, 7, 11, '2022-02-10', '2022-02-21', 330); -- -------------------------------------------------------- -- -- Structure de la table Type -- CREATE TABLE IF NOT EXISTS Type ( idType int(3) NOT NULL, libelléType varchar(30) NOT NULL, PRIMARY KEY (idType) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; -- -- Déchargement des données de la table Type -- INSERT INTO Type (idType, libelléType) VALUES (1, 'Berline'), (2, 'Coupé'), (3, 'Break'), (4, 'SUV'), (5, 'Utilitaire'), (6, 'Citadine'); -- -------------------------------------------------------- -- -- Structure de la table Voiture -- CREATE TABLE IF NOT EXISTS Voiture ( idVoiture int(3) NOT NULL, Marque varchar(30) NOT NULL, Modèle varchar(30) NOT NULL, Localisation varchar(30) NOT NULL, PrixJournalier float NOT NULL, idEntreprise int(3) NOT NULL, idTypeVoiture int(3) NOT NULL, PRIMARY KEY (idVoiture) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; -- -- Déchargement des données de la table Voiture -- INSERT INTO Voiture (idVoiture, Marque, Modèle, Localisation, PrixJournalier, idEntreprise, idTypeVoiture) VALUES (1, 'Mercedes', 'Classe A', 'Montpellier', 50, 1, 2), (4, 'Mercedes', 'Vito', 'Montpellier', 35, 1, 5), (5, 'BMW', 'Serie 1', 'Montpellier', 55, 1, 1), (6, 'BMW', 'M2', 'Montpellier', 65, 1, 2), (7, 'Dacia', 'Sandero', 'Paris', 27, 4, 4); COMMIT; /*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */; /*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */; /*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;`)


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