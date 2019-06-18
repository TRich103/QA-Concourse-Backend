var express = require('express');
var privacyRoutes = express.Router(); 
var CryptoJS = require("crypto-js");
const winston = require('../config/winston');
const databaseLogger = require('../config/winston-db')

let PrivacyRecords = require('../models/gdpr.model');
let Trainee = require('../models/trainee.model');
let User = require('../models/staff');
var moment = require('moment');


privacyRoutes.get('/:id', function(req, res){
    let logger = databaseLogger.createLogger("universal");
    console.log(req.params.id);
    PrivacyRecords.findOne({user : req.params.id}, function(err, record){
        if(!record){
            res.send('Failed');
        }
        else{
            ///decrypting and send back result
            console.log('decrypting and sending');
            let permission = CryptoJS.AES.decrypt(record.permission, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
            if(permission === "true"){
                res.send('Success');
            }
            else{
                res.send('Failed');
            }
            logger.verbose("checking if user "+ req.params.id +"has accepted our privacy policy "+moment().format('h:mm:ss a'));
            winston.info("checking if user "+ req.params.id +"has accepted our privacy policy "+moment().format('h:mm:ss a'));
        }
    }).catch( err => {
        res.status(205).send('An Error has occured');
    }
    );
});

privacyRoutes.get('/accept/:id', function(req, res){
    console.log(req.params.id);
        Trainee.findById(req.params.id, function(err, trainee){
            if(!trainee){
                User.findById(req.params.id, function(err, user){
                    if(!user){
                        winston.error("could not find user or trainee!" + +moment().format('h:mm:ss a'));
                    }
                    else{
                        let email = CryptoJS.AES.decrypt(user.email
                            , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                            , { iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000") })
                            .toString(CryptoJS.enc.Utf8);
                        let logger = databaseLogger.createLogger(email);
                        let logUser = req.params.id;
                        let permission = CryptoJS.AES.encrypt('true', '3FJSei8zPx').toString();
                        let newRecord = new PrivacyRecords({ permission: permission, user: logUser });
                        console.log(newRecord);
                        newRecord.save();
                        logger.info('Privacy notice has been accepted ' + moment().format('h:mm:ss a'));
                        winston.info('Privacy notice has been accepted ' + moment().format('h:mm:ss a'));
                        res.send('Success');
                    }
                })
            }
            else{
                let email = CryptoJS.AES.decrypt(trainee.trainee_email
                    , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                    , { iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000") })
                    .toString(CryptoJS.enc.Utf8);
                let logger = databaseLogger.createLogger(email);
                let user = req.params.id;
                let permission = CryptoJS.AES.encrypt('true', '3FJSei8zPx').toString();
                let newRecord = new PrivacyRecords({ permission: permission, user: user });
                console.log(newRecord);
                newRecord.save();
                logger.info('Privacy notice has been accepted ' + moment().format('h:mm:ss a'));
                winston.info('Privacy notice has been accepted ' + moment().format('h:mm:ss a'));
                res.send('Success');
            }
        });
})




module.exports = privacyRoutes;