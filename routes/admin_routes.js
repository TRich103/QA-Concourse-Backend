var express = require('express');
var adminRoutes = express.Router();

const fs = require('fs');
const crypto = require('crypto');
const nodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');
const winston = require('../config/winston');
const databaseLogger = require('../config/winston-db')

var jwt = require('jsonwebtoken');
var AuthenticationController = require('../config/authentication');  
var passport = require ('passport');

var CryptoJS = require("crypto-js");
var secret = require('../config/auth.js');
var requireAuth = passport.authenticate('jwt', {session: false});

let User = require('../models/staff');
let Records = require('../models/record.model');
let Trainee = require('../models/trainee.model');
var moment = require('moment');

//gets all users
adminRoutes.route('/', requireAuth, AuthenticationController.roleAuthorization(['admin'])).get(function(req, res) {
    User.find(function(err, staff) {
        let logger = databaseLogger.createLogger("universal")
        if (err) {
           console.log(err);
		   winston.error(err);
        } else {
            //
            staff.map(function(currentStaff, i){
                currentStaff.email = CryptoJS.AES.decrypt(currentStaff.email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")}).toString(CryptoJS.enc.Utf8);
                currentStaff.fname = CryptoJS.AES.decrypt(currentStaff.fname, 'c9nMaacr2Y').toString(CryptoJS.enc.Utf8);
                currentStaff.lname = CryptoJS.AES.decrypt(currentStaff.lname, 'c9nMaacr2Y').toString(CryptoJS.enc.Utf8);
                currentStaff.status = CryptoJS.AES.decrypt(currentStaff.status, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
            });
            res.json(staff);
			logger.verbose(moment().format('h:mm:ss a')+' All staff users were collected successfully ');            
			winston.info(moment().format('h:mm:ss a') +' All staff users were collected successfully ');
        }
    });
});

// Get logs 
adminRoutes.route('/getServerLogs').get(function(req, res){
    let logger = databaseLogger.createLogger("universal")
	fs.readFile('./logs/server_logs.log', 'utf8', function(err,data) {
		if(err){
            res.send(err);
            winston.info(moment().format('h:mm:ss a')+' Unsuccessful at getting server logs ');
            logger.verbose(moment().format('h:mm:ss a')+' Unsuccessful at getting server logs ');
		}else{
		let splitted = data.toString().split("\\r");
            res.send(splitted);
            winston.info(moment().format('h:mm:ss a')+' Successfully got server logs ');
            logger.verbose(moment().format('h:mm:ss a')+' Successfully got server logs ');
		}
		});
	});

//gets single user by id
adminRoutes.route('/staff/:id').get(function(req, res) {
    let id = req.params.id;
    User.findById(id, function(err, staff) {
        console.log('STAFF TRYING TO FIND :');
        console.log(staff);
        if(!staff){
            res.json(null);
        }
        else{
		    staff.fname = CryptoJS.AES.decrypt(staff.fname, 'c9nMaacr2Y').toString(CryptoJS.enc.Utf8);
		    staff.lname = CryptoJS.AES.decrypt(staff.lname, 'c9nMaacr2Y').toString(CryptoJS.enc.Utf8);
		    staff.email = CryptoJS.AES.decrypt(staff.email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")}).toString(CryptoJS.enc.Utf8);
            staff.status = CryptoJS.AES.decrypt(staff.status, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
            res.json(staff);
            let logger = databaseLogger.createLogger(staff.email);
            winston.info(moment().format('h:mm:ss a') + ' Returned Staff details: ' + staff.email);
            logger.verbose(moment().format('h:mm:ss a') + ' Returned Staff details: ' + staff.email);
        }
    })
    .catch(err => {
        res.status(400).send("Staff doesn't exist");
		console.log('staff doesnt exist');
        winston.error(moment().format('h:mm:ss a') + ' tried to get staff member but does not exist ' + err);
    });
});
//update single user
adminRoutes.route('/update-staff/:id').post(function(req, res){
	let id = req.params.id;
	User.findById(id, function(err, staff) {
        if (!staff)
            res.status(404).send("data is not found");
        else{
            let logger = databaseLogger.createLogger(staff.email);
            staff.email = CryptoJS.AES.encrypt(req.body.email.toLowerCase(), CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")});
			staff.fname = CryptoJS.AES.encrypt(req.body.fname, 'c9nMaacr2Y').toString();
            staff.lname = CryptoJS.AES.encrypt(req.body.lname, 'c9nMaacr2Y').toString();

            staff.save().then(staff => {
                res.json('Staff updated!');
                winston.info('Staff: '+staff.email+' has updated their details '+moment().format('h:mm:ss a'));
				logger.info('Staff: '+staff.email+' has updated their  details '+moment().format('h:mm:ss a'));                
				})
            .catch(err => {
                res.status(400).send("Update not possible");
                winston.error('Staff: '+staff.email+' tried to update there details but got error: ' + err + " "+ moment().format('h:mm:ss a'))
                logger.error('Staff: '+staff.email+' tried to update there details but got error: ' + err + " "+ moment().format('h:mm:ss a'))
            });
        }    
    });
}); 

//gets single user by email
adminRoutes.route('/getByEmail').post(function(req,res) {
    let logger = databaseLogger.createLogger(req.body.staff_email)
    let staff_email = CryptoJS.AES.encrypt(req.body.staff_email.toLowerCase(), CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")}).toString();
    User.findOne({email: staff_email}, function(err, user) {
        if(!user){
            res.status(205).send("User doesn't exist");
            winston.error(moment().format('h:mm:ss a') + " User: "+ req.body.staff_email+ " doesn't exist ");
            logger.error(moment().format('h:mm:ss a') + " User: "+ req.body.staff_email+ " doesn't exist ");
        }
        else{
            var bytes  = CryptoJS.AES.decrypt(user.email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")});
            user.email = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(user.fname, '3FJSei8zPx');
            user.fname = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(user.lname, '3FJSei8zPx');
            user.lname = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(user.status, '3FJSei8zPx');
            user.status = bytes.toString(CryptoJS.enc.Utf8);
            res.json(user);
            winston.info(moment().format('h:mm:ss a') + " User: "+req.body.staff_email+" info returned ");
            logger.verbose(moment().format('h:mm:ss a') +" User: "+req.body.staff_email+" info returned ");
        }
    })
    .catch(err => {
        res.status(205).send("User doesn't exist");
        winston.error(err);
        logger.error(err);
    })
})

//adds new user to database
adminRoutes.route('/addUser', requireAuth).post(function(req,res){
    let logger = databaseLogger.createLogger(req.body.email);
    //encrypt before adding
    var newUser = new User({
      email: CryptoJS.AES.encrypt(req.body.email.toLowerCase(), CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")}).toString(),
      password: CryptoJS.AES.encrypt(req.body.password, 'c9nMaacr2Y'),
      fname: CryptoJS.AES.encrypt(req.body.fname, 'c9nMaacr2Y').toString(),
      lname: CryptoJS.AES.encrypt(req.body.lname, 'c9nMaacr2Y').toString(),
      role: req.body.role,
      status: CryptoJS.AES.encrypt(req.body.status, '3FJSei8zPx').toString()
    });
    User.createUser(newUser, function(err, user){
      if(err){
          console.log(err);
          console.log('duplicate email');
          res.status(205).send();
      }
      else{
        const token = jwt.sign(user._id.toJSON(), secret.secret); //user need to be JSONed or causes an error
        logger.info(moment().format('h:mm:ss a') + " "+ user.role +' ' + req.body.email+ ' created.');
        winston.info(moment().format('h:mm:ss a') + " "+ user.role +' ' + req.body.email+ ' created. ');
		console.log(' created '+ user.role + ' ' + req.body.email );
        return res.json({result: true, role: user.role, token});
      }
    });
});


//Should be deleted. Not neccessary anymore.
//adds user with encryption(used to add users directly from postman)
adminRoutes.route('/addUser/postman').post(function(req,res){
    CryptoJS.pad.NoPadding = {pad: function(){}, unpad: function(){}};
    var key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
    var iv  = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
    
    var encrypted = CryptoJS.AES.encrypt(req.body.email, key, {iv: iv});
    var status =  CryptoJS.AES.encrypt(req.body.status, '3FJSei8zPx').toString();
        //var encryptedemail = CryptoJS.AES.encrypt(encrypted, 'bW5Ks7SIJu');
        var newUser = new User({
          email: encrypted.toString(),
          status: status.toString(),
          fname: CryptoJS.AES.encrypt(req.body.fname, 'c9nMaacr2Y').toString(),
          lname: CryptoJS.AES.encrypt(req.body.lname, 'c9nMaacr2Y').toString(),
          password: req.body.password,
          role: req.body.role
        });
        
        if(encrypted.toString() === newUser.email){
            console.log(true);
        }else{
            console.log(encrypted.toString());
            console.log(newUser.email.toString());
            console.log(false);
        }
        let c = CryptoJS.AES.decrypt(newUser.email, key, {iv: iv});
        console.log(c.toString(CryptoJS.enc.Utf8));
    
        User.createUser(newUser, function(err, user){
          if(err){
            console.log(err);
            console.log('duplicate email');
            res.status(205).send();
          }else{
            const token = jwt.sign(user._id.toJSON(), secret.secret); //user need to be JSONed or causes an error
            console.log(token);
            return res.json({result: true, role: user.role, token});
          }
        });
    });

//deletes user by id
adminRoutes.route('/delete/:id').get(function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if(!user){
            res.status(404).send("user is not found");
        }
        else{
            let email = CryptoJS.AES.decrypt(user.email
                , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                , {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
                .toString(CryptoJS.enc.Utf8)
            let logger = databaseLogger.createLogger(email);
            user.status =  CryptoJS.AES.encrypt("Suspended", '3FJSei8zPx');
            user.save().then(user => {
                res.json('User deleted');
                logger.info(moment().format('h:mm:ss a') + 'User: '+email+' has been suspended ');
                winston.info(moment().format('h:mm:ss a') + 'User: '+email+' has been suspended ');
            })
            .catch(err => {
                res.status(400).send("Delete not possible");
                logger.error(moment().format('h:mm:ss a') +' User:'+email+' could not be suspended. Error: ' + err)
                winston.error(moment().format('h:mm:ss a') + ' User:'+email+' could not be suspended. Error: ' + err)
            });
        }
    });
  });   

adminRoutes.route('/reactivate/:id').get(function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if(!user ){
            res.status(404).send("user is not found");
        }
        else{
            let email = CryptoJS.AES.decrypt(user.email
                , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                , {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
                .toString(CryptoJS.enc.Utf8)
            let logger = databaseLogger.createLogger(email);
            user.status =  CryptoJS.AES.encrypt("Active", '3FJSei8zPx');
            user.save().then(user => {
                res.json('User reactivated');
                logger.info(moment().format('h:mm:ss a')+' User: '+email+' has been reactivated ')
                winston.info(moment().format('h:mm:ss a')+' User: '+email+' has been reactivated ')
            })
            .catch(err => {
                res.status(400).send("Reactivation not possible");
                 winston.error(moment().format('h:mm:ss a') + 'User:'+email+' could not be reactivated. Error: ' + err)
            });
        }

    })
})

//checks if user password reset token is valid
adminRoutes.route('/reset-staff/:token').get(function(req, res) {
        User.findOne({password_token: req.params.token, password_expires: {$gt: Date.now()}}).then((staff) => {
          if (staff == null) {
			winston.error(moment().format('h:mm:ss a') + ' user password reset link is invalid or has expired ');
            res.status(403).send('password reset link is invalid or has expired');
          } 
          else {
			  winston.info(moment().format('h:mm:ss a') + ' user password reset link recevied status 200 ');
              res.status(200).send({
                staff_id: staff._id,
                message: 'password reset link a-ok',
              });
          }
        });
      });  

adminRoutes.route('/removeToken/:token').get(function(req, res) {
        User.findOne({password_token: req.params.token}).then((user) => {
        console.log(Date.now())
        if (!user) {
            console.error('No token found');
            winston.error(moment().format('h:mm:ss a') + ' No token found ')
            res.status(403).send('No token found');
        } 
        else {
            user.password_expires = Date.now();
            user.save().then(()=>
                {res.status(200).send("Token destroyed")}
            )      
        }
        });
    });
    
    
    //updates user password      
adminRoutes.route('/update-mypassword-staff/:id').post(function(req, res) {
    //encrypt before updating
    User.findById(req.params.id, function(err, staff) {
        if (!staff)
            res.status(404).send("data is not found");
        else{
            let email = CryptoJS.AES.decrypt(staff.email
                , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                , {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
                .toString(CryptoJS.enc.Utf8)
            let logger = databaseLogger.createLogger(email);

            User.comparePassword(req.body.previous, staff.password, function(err, isMatch){
                if(err){
                      console.log(err);
                      winston.error(err);
                      logger.error('Unable to login, Error: ' + err);
                      res.send('Something went wrong!');
                  }
                   else if(!isMatch){
                      console.log('user: ' + staff._id + ' entered wrong password');
                      winston.error('user: ' + staff._id + ' entered wrong password');
                      res.send('Old password did not match!');
                  }
                  else {
                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(req.body.password, salt, function(err, hash) {
                            req.body.password = hash;
                            staff.password = req.body.password;
                            staff.save().then(staff => {
                            winston.info('User: '+email+' has updated thier password '+moment().format('h:mm:ss a'))
                            logger.info('User: '+email+' has updated thier password '+moment().format('h:mm:ss a'))
                            res.json('Password updated!');
                        })
                        .catch(err => {
                            winston.error('User: '+email+' could not update thier password. Error: ' + err + " "+moment().format('h:mm:ss a'));
                            logger.error('User: '+email+' could not update thier password. Error: ' + err + " "+ moment().format('h:mm:ss a'));
                            res.status(400).send("Update not possible");
                        });
                        });
                      });
                  }
           })
        }      
    });
}); 
   

//sends password reset email for staff
adminRoutes.route('/send-email-staff').post(function(req, res) {
        let logger = databaseLogger.createLogger(req.body.email)
        var key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
        var iv  = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
        var email = CryptoJS.AES.encrypt(req.body.email, key, {iv: iv}).toString();
		winston.info('password reset email has been sent to' + email.toString() +" " + moment().format('h:mm:ss a'));
        User.findOne({email: email}, function(err, staff) {
            console.log(email);
			winston.info(staff);
            if (!staff){
                res.status(404).send("Email is not found");
                winston.error('Staff email was not found: ' + req.body.email + " " + moment().format('h:mm:ss a'));
                logger.error('Staff email was not found: ' + req.body.email + " " + moment().format('h:mm:ss a'));
            }
            else{
                const token = crypto.randomBytes(20).toString('hex');
                staff.password_token = token;
                staff.password_expires = Date.now() + 86400000;
                staff.save().then(()=>
				console.log('email token generated'),
                winston.info('user has had a reset email sent to them'));
                let fname = CryptoJS.AES.decrypt(staff.fname, 'c9nMaacr2Y').toString(CryptoJS.enc.Utf8);
                var transporter = nodeMailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: process.env.SYSTEM_EMAIL,
                        pass: process.env.SYSTEM_PASSWORD
                    }
                });
                var mailOptions = {
                    from: process.env.SYSTEM_EMAIL, // sender address
                    to: req.body.email, // list of receivers
                    subject: 'Password Reset', // Subject line
                    text: 'Hello '+fname+',\n Please navigate to the following link to activate your staff account and set your password: http://'+process.env.REACT_APP_AWS_IP+':3000/changePasswordStaff/'+token // plain text body
                }            
    
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(mailOptions.text);
						winston.error(error + " " + moment().format('h:mm:ss a'));
                        return console.log(error);
                    }
                    winston.info('%s Message %s sent: %s', moment().format('h:mm:ss a'), info.messageId, info.response);
                    logger.verbose(moment().format('h:mm:ss a') + ' Staff password reset email sent to: ' + req.body.email);
                    res.status(200).json({'email': 'Email Sent'});
                });
            }
        });
    });
    
//updates user password      
adminRoutes.route('/update-password-staff/:token').post(function(req, res) {
        //encrypt before updating
        User.findOne({password_token: req.params.token}, function(err, staff) {
            if (!staff)
                res.status(404).send("data is not found");
            else{
                let email = CryptoJS.AES.decrypt(staff.email
                    , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                    , {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
                    .toString(CryptoJS.enc.Utf8)
                let logger = databaseLogger.createLogger(email);
                var active =  CryptoJS.AES.encrypt("Active", '3FJSei8zPx').toString();
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(req.body.password, salt, function(err, hash) {
                        req.body.password = hash;
                        staff.status = active
                        staff.password = req.body.password;
                        staff.save().then(staff => {
                        winston.info('User: '+email+' has updated thier password '+moment().format('h:mm:ss a'))
                        logger.info('User: '+email+' has updated thier password '+moment().format('h:mm:ss a'))
                        res.json('Password updated!');
                    })
                    .catch(err => {
                        winston.error('User: '+email+' could not update thier password. Error: ' + err + " "+moment().format('h:mm:ss a'));
                        logger.error('User: '+email+' could not update thier password. Error: ' + err + " "+ moment().format('h:mm:ss a'));
                        res.status(400).send("Update not possible");
                    });
                    });
                  });
            }      
        });
    });   
    adminRoutes.route('/getRecord/:id').get(function(req, res){
        User.findById(req.params.id, function(err, user){
            let logger = databaseLogger.createLogger('universal')
            if(!user){
                Trainee.findById(req.params.id, function(err, trainee){
                    if(!trainee){
                        winston.error("User not found "+moment().format('h:mm:ss a'))
                        logger.error("User not found "+moment().format('h:mm:ss a'))
                    }
                    else{
                        let email = CryptoJS.AES.decrypt(trainee.trainee_email
                            , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                            , {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
                            .toString(CryptoJS.enc.Utf8);
                        Records.find({label: email}, function(err, records){
                            res.json(records);
                        })    
                    }
                })
            }
            else{
                let email = CryptoJS.AES.decrypt(user.email
                    , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                    , {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
                    .toString(CryptoJS.enc.Utf8);
                Records.find({label: email}, function(err, records){
                    res.json(records);
                })       
            }   
        })
    })

    adminRoutes.route('/getAllRecords').get(function(req,res){
        Records.find(function(err, record){
            console.log("records"+record)
            res.json(record)
        })
    })

//gets trainee by id and adds expense
adminRoutes.route('/expenses/:id').post(function (req, res) {
    console.log(req.params.id);
    console.log(req.body);
    let name;
    User.findById(req.body.addedBy, function (err, user) {
        name = CryptoJS.AES.decrypt(user.fname, 'c9nMaacr2Y').toString(CryptoJS.enc.Utf8) + " "+CryptoJS.AES.decrypt(user.lname, 'c9nMaacr2Y').toString(CryptoJS.enc.Utf8);
    })
    Trainee.findById(req.params.id, function (err, trainee) {
        console.log(trainee);
        if (!trainee) {
            console.log('notFound');
            res.status(404).send("data is not found");
        }
        else {
            console.log('trainee found');
            let email = CryptoJS.AES.decrypt(trainee.trainee_email
                , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                , { iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000") })
                .toString(CryptoJS.enc.Utf8);
                let logger = databaseLogger.createLogger(email);
                let fname = CryptoJS.AES.decrypt(trainee.trainee_fname, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
                let lname = CryptoJS.AES.decrypt(trainee.trainee_lname, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);

            console.log(trainee);
            
             
            console.log(req.body.amount);
           
            let data = trainee.monthly_expenses;
            data.push({
				"expenseType":CryptoJS.AES.encrypt(req.body.expenseType, '3FJSei8zPx').toString(),
				"amount":CryptoJS.AES.encrypt(req.body.amount, '3FJSei8zPx').toString(),
				"status":CryptoJS.AES.encrypt('pending', '3FJSei8zPx').toString()
				})
            console.log("DATA")
            console.log(data)
            trainee.monthly_expenses = data;

            trainee.save().then(trainee => {
                res.json('Trainee updated!');
                winston.info(moment().format('h:mm:ss a') + ' - Changed By('+name+"): "+ ' has added expenses for '+ fname +" for "+req.body.expenseType + " for the amount of "+req.body.amount);
                logger.info(moment().format('h:mm:ss a') + ' - Changed By('+name+"): "+' has added expenses for '+ fname +" for "+req.body.expenseType + " for the amount of "+req.body.amount);
                //logger.info(moment().format('h:mm:ss a') +' Trainee: ' + fname+ " "+ lname +' has requested expenses for '+req.body.expenseType + " for the amount of "+req.body.amount + " added by "+name);
            })
                .catch(err => {
                    res.status(400).send("Update not possible");
                    winston.error(moment().format('h:mm:ss a') + ' - Changed By('+name+"): "+ email + ' tried to request expense but got an error: ' + err)
                    logger.error(moment().format('h:mm:ss a')+ ' - Changed By('+name+"): "+ ' tried to request expense but got an error: ' + err)
                });
        }
    });
});


//get trainee by id with expense
adminRoutes.route('/getexp/:id').get(function(req,res){
    Trainee.findById(req.params.id, function (err, trainee){
        if(!trainee){
            res.status(400).send("data is not found");
        }
        else {
            let email = CryptoJS.AES.decrypt(trainee.trainee_email
                , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                , { iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000") })
                .toString(CryptoJS.enc.Utf8);
            let logger = databaseLogger.createLogger(
                CryptoJS.AES.decrypt(trainee.trainee_email
                , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                , { iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000") })
                .toString(CryptoJS.enc.Utf8)
                );
            trainee.monthly_expenses.map(expense => {
             //need to add loggin 
             winston.verbose(moment().format('h:mm:ss a') +' Trainee '+ email + ' expenses have been gotten ');
             logger.verbose( moment().format('h:mm:ss a') +' Trainee '+ email + ' expenses have been gotten ');
             expense.expenseType = CryptoJS.AES.decrypt(expense.expenseType,'3FJSei8zPx').toString(CryptoJS.enc.Utf8);
             expense.amount = CryptoJS.AES.decrypt(expense.amount,'3FJSei8zPx').toString(CryptoJS.enc.Utf8);
			 expense.status = CryptoJS.AES.decrypt(expense.status,'3FJSei8zPx').toString(CryptoJS.enc.Utf8);
            } )
            res.json(trainee)
        }
    }) 
    .catch(err => {
        res.status(400).send("couldnt get");
    });
});

//Plan B on update Expenses
adminRoutes.route('/updateExpenses/:id').post(function(req, res){
	Trainee.findById(req.params.id, function (err, trainee) {
        if (!trainee) {
            console.log('notFound');
            res.status(404).send("data is not found");
        }
        else {
            let email = CryptoJS.AES.decrypt(trainee.trainee_email,CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), { iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000") }).toString(CryptoJS.enc.Utf8);
            let logger = databaseLogger.createLogger(CryptoJS.AES.decrypt(trainee.trainee_email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), { iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000") }).toString(CryptoJS.enc.Utf8));
            
			trainee.monthly_expenses.map(expense => {
             expense.expenseType = CryptoJS.AES.encrypt(expense.expenseType,'3FJSei8zPx').toString(CryptoJS.enc.Utf8);
             expense.amount = CryptoJS.AES.encrypt(expense.amount,'3FJSei8zPx').toString(CryptoJS.enc.Utf8);
			 expense.status = CryptoJS.AES.encrypt(req.body.status,'3FJSei8zPx').toString(CryptoJS.enc.Utf8);
            })
			
			let data = trainee.monthly_expenses;
			
			trainee.monthly_expenses = data;
			
			trainee.save().then(trainee => {
                res.json('Trainee updated!');
				console.log(res.json);
                winston.info('Trainee: ' + email + ' has requested expenses for '+req.body.expenseType + " for the amount of "+req.body.amount + " added by "+name+" "+moment().format('h:mm:ss a'));
                logger.info('Trainee: ' + email +' has requested expenses for '+req.body.expenseType + " for the amount of "+req.body.amount + " added by "+name+" "+moment().format('h:mm:ss a'));
            }).catch(err => {
                    res.status(400).send("Update not possible");
                    winston.error('Trainee: ' + email + ' tried to request expense but got an error: ' + err + " " + moment().format('h:mm:ss a'))
                    logger.error('Trainee: ' + email + ' tried to request expense but got an error: ' + err + " " + moment().format('h:mm:ss a'))
               });
        }
    })
});

//gets trainee by id and removes expense
adminRoutes.route('/removeExpenses/:id').post(function (req, res) {
    let name;
    User.findById(req.body.addedBy, function (err, user) {
        name = CryptoJS.AES.decrypt(user.fname, 'c9nMaacr2Y').toString(CryptoJS.enc.Utf8) + " "+CryptoJS.AES.decrypt(user.lname, 'c9nMaacr2Y').toString(CryptoJS.enc.Utf8);
    })

    function arrayRemove(arr, json, location) {
        console.log('here it is: ' + location);
        let count = 0;
        let result = arr.filter(function(ele){
                if(ele.amount !== json.amount && ele.expenseType !== json.expenseType){
                    console.log(ele);
                    ele.amount = CryptoJS.AES.encrypt(ele.amount, '3FJSei8zPx').toString();
                    ele.expenseType = CryptoJS.AES.encrypt(ele.expenseType, '3FJSei8zPx').toString();
                    count++;
                    return ele;
                } else if(ele.amount !== json.amount || ele.expenseType !== json.expenseType){
                    console.log(ele);
                    ele.amount = CryptoJS.AES.encrypt(ele.amount, '3FJSei8zPx').toString();
                    ele.expenseType = CryptoJS.AES.encrypt(ele.expenseType, '3FJSei8zPx').toString();
					          ele.status = CryptoJS.AES.encrypt(ele.status, '3FJSei8zPx').toString();
                    count++;
                    return ele;
                }else{
                    console.log('count where found is: '+count);
                    console.log(ele);
                    if(count === location){

                    }
                    else{
                        ele.amount = CryptoJS.AES.encrypt(ele.amount, '3FJSei8zPx').toString();
                        ele.expenseType = CryptoJS.AES.encrypt(ele.expenseType, '3FJSei8zPx').toString();
                        count++;
                        return ele;
                    }
                }
        });
        return result;
     }
     
    //arrayRemove(array, 6);
    Trainee.findById(req.params.id, function (err, trainee) {
        console.log(trainee);
        if (!trainee) {
            console.log('notFound');
            res.status(404).send("data is not found");
        }
        else {
            console.log('trainee found');
            let email = CryptoJS.AES.decrypt(trainee.trainee_email
                , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                , { iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000") })
                .toString(CryptoJS.enc.Utf8);
                let logger = databaseLogger.createLogger(email);

            trainee.monthly_expenses.map(expense => {
                    //console.log(expense);
                    expense.expenseType = CryptoJS.AES.decrypt(expense.expenseType,'3FJSei8zPx').toString(CryptoJS.enc.Utf8);
                    expense.amount = CryptoJS.AES.decrypt(expense.amount,'3FJSei8zPx').toString(CryptoJS.enc.Utf8);
					expense.status = CryptoJS.AES.decrypt(expense.status,'3FJSei8zPx').toString(CryptoJS.enc.Utf8);
                } )
           
            let data = trainee.monthly_expenses;
            console.log('When sent, it is: '+req.body.location);
            data = arrayRemove(data, {"expenseType": req.body.expenseType, "amount": req.body.amount}, req.body.location);
            trainee.monthly_expenses = data;

            trainee.save().then(trainee => {
                res.json('Trainee updated!');
                winston.info(moment().format('h:mm:ss a') +' - Changed By('+name+"): "+ ' removed trainee :'+ email + ' expense ' + req.body.expenseType + ":"+ req.body.amount);
                //winston.info(moment().format('h:mm:ss a') + ' Trainee: ' + email + ' expense has been deleted');
                logger.info(moment().format('h:mm:ss a') + ' - Changed By('+name+"): "+' removed trainee: ' + email + ' expense '+req.body.expenseType + ":"+ req.body.amount);
            })
                .catch(err => {
                    res.status(400).send("Update not possible");
                    winston.error(moment().format('h:mm:ss a') + ' - Changed By('+name+"): "+' failed to remove trainee: ' + email + ' expense '+req.body.expenseType +":"+req.body.amount + "but got :"+ err)
                    logger.error(moment().format('h:mm:ss a') + ' - Changed By('+name+"): "+' failed to remove trainee: ' + email + ' expense '+req.body.expenseType +":"+req.body.amount + "but got :"+ err)
                });
        }
    });
});

        //updates user password      
        adminRoutes.route('/update-mypassword-staff/:id').post(function(req, res) {
            //encrypt before updating
            User.findById(req.params.id, function(err, staff) {
                if (!staff)
                    res.status(404).send("data is not found");
                else{
                    let email = CryptoJS.AES.decrypt(staff.email
                        , CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939")
                        , {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")})
                        .toString(CryptoJS.enc.Utf8)
                    let logger = databaseLogger.createLogger(email);
        
                     User.comparePassword(req.body.previous, staff.password, function(err, isMatch){
                        if(err){
                              console.log(err);
                              winston.error(err);
                              logger.error('Unable to login, Error: ' + err);
                              res.send('Something went wrong!');
                          }
                           else if(!isMatch){
                              console.log('user: ' + staff._id + ' entered wrong password');
                              winston.error('user: ' + staff._id + ' entered wrong password');
                              res.send('Old password did not match!');
                          }
                          else {
                            bcrypt.genSalt(10, function(err, salt) {
                                bcrypt.hash(req.body.password, salt, function(err, hash) {
                                    req.body.password = hash;
                                    staff.password = req.body.password;
                                    staff.save().then(staff => {
                                    winston.info(moment().format('h:mm:ss a')+' User: '+email+' has updated thier password ')
                                    logger.info(moment().format('h:mm:ss a')+ 'User: '+email+' has updated thier password ')
                                    res.json('Password updated!');
                                })
                                .catch(err => {
                                    winston.error(moment().format('h:mm:ss a') +' User: '+email+' could not update thier password. Error: ' + err);
                                    logger.error(moment().format('h:mm:ss a')+' User: '+email+' could not update thier password. Error: ' + err);
                                    res.status(400).send("Update not possible");
                                });
                                });
                              });
                          }
                   })
                }      
            });
        });


module.exports = adminRoutes;