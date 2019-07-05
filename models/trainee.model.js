const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
var CryptoJS = require("crypto-js");

let Trainee = new Schema({
    trainee_fname: {
        type: String,
        required: true
    },
    trainee_lname: {
        type: String,
        required: true
    },
    trainee_email: {
        type: String,
        required: true, 
        unique: true 
    },
    trainee_password: {
        type: String,
        required: true
    },
	trainee_bank_name: {
		type: String
	},
    trainee_account_no: {
        type: String
    },    
    trainee_sort_code: {
        type: String
    },
    trainee_approved:{
        type: Boolean,
        default: false
    },
    trainee_password_token:{
        type: String
    },
    trainee_password_expires:{
        type: String,
        format: Date
    },
    trainee_start_date:{
        type: String,
        required:true
    },
    trainee_end_date:{
        type: String,
        required: true
    },
	trainee_bench_start_date:{
		type: String
	},
	trainee_bench_end_date:{
		type: String
	},
    added_By:{
        type: String,
        required: true
    },
    status:{
        type: String,
        // enum:['Incomplete', 'Active', 'Suspended'],
        // default: 'Incomplete',
        required: true
    },
    bursary:{
        type: String,
        required: true
    },
    bursary_amount:{
        type: String,
        format: Number,
        required: true
    },
	trainee_days_worked:{
		type: String
	},
	bank_holiday:{
        type: Boolean
    },
    monthly_expenses:{
        type: Array,
        default: []
    },
    trainee_gender: {
        type: String,
    },
    trainee_uniName: {
        type: String,
    },
    trainee_phone: {
        type: String,
        required: true
    },
    trainee_degree: {
        type: String,
    },
    trainee_chosenTech: {
        type: String,
    },
    trainee_intake: {
        type: String,
        required: true
    },
    trainee_geo: {
        type: String,
    },
    trainee_clearance: {
        type: String,
    },
    trainee_businessEmail: {
        type: String
    },
    trainee_aptitude_score: {
        type: String
    },
    trainee_languages:{
        type: String
    },
    documents_signed:{
        type: String
    },
    sent_Agreement:{
        type: String
    },
    received_Agreement:{
        type: String
    },
    accomodation: {
        type: String
    },
    java_test_Score:{
        type: String
    },
    MTE : {
        type: String
    },
    date_Achieved:{
        type: String
    }
});
module.exports = mongoose.model('Trainee', Trainee);

var test = module.exports = mongoose.model('Trainee', Trainee);

module.exports.getTraineeByEmail = function(email, callback){
    var query = {trainee_email: email};
    test.findOne(query, callback);
  }

  
module.exports.comparePassword = function(traineePassword, hash, callback){
    bcrypt.compare(traineePassword, hash, function(err, isMatch) {
      if(err) throw err;
      callback(null, isMatch);
    });
  }

//   trainee_gender: {
//     trainee_uniName: {
//     trainee_phone: {
 
//     trainee_degree: {
//     trainee_chosenTech: {
//     trainee_intake:
//     trainee_geo:
//     trainee_clearance:
//     trainee_businessEmail:
//     trainee_aptitude_score:
//     trainee_languages
//     documents_signed
//     sent_Agreement
//     received_Agreement
//     accomodation:
//     java_test_Score
//     MTE :
//     date_Achieved

test.updateMany({trainee_gender:null}, {$set:{trainee_gender: CryptoJS.AES.encrypt("", '3FJSei8zPx').toString()}});
test.updateMany({trainee_uniName:null}, {$set:{trainee_uniName: CryptoJS.AES.encrypt("", '3FJSei8zPx').toString()}});
test.updateMany({trainee_phone:null}, {$set:{trainee_phone: CryptoJS.AES.encrypt("", '3FJSei8zPx').toString()}});
test.updateMany({trainee_degree:null}, {$set:{trainee_degree: CryptoJS.AES.encrypt("", '3FJSei8zPx').toString()}});
test.updateMany({trainee_chosenTech:null}, {$set:{trainee_chosenTech: CryptoJS.AES.encrypt("", '3FJSei8zPx').toString()}});
test.updateMany({trainee_intake:null}, {$set:{trainee_intake: CryptoJS.AES.encrypt("", '3FJSei8zPx').toString()}});
test.updateMany({trainee_geo:null}, {$set:{trainee_geo: CryptoJS.AES.encrypt("", '3FJSei8zPx').toString()}});
test.updateMany({trainee_clearance:null}, {$set:{trainee_clearance: CryptoJS.AES.encrypt("", '3FJSei8zPx').toString()}});
//test.updateMany({trainee_businessEmail:null}, {$set:{trainee_businessEmail: CryptoJS.AES.encrypt("", '3FJSei8zPx').toString()}});
// test.updateMany({trainee_aptitude_score:null}, {$set:{trainee_aptitude_score: CryptoJS.AES.encrypt("", '3FJSei8zPx').toString()}});
// test.updateMany({trainee_languages:null}, {$set:{trainee_languages: CryptoJS.AES.encrypt("", '3FJSei8zPx').toString()}});
// test.updateMany({:null}, {$set:{trainee_gender: CryptoJS.AES.encrypt("", '3FJSei8zPx').toString()}});