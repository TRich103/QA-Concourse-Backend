const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

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
        required: true
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
        required: true
    },
    trainee_intake: {
        type: String,
        required: true
    },
    trainee_geo: {
        type: String,
        required: true
    },
    trainee_clearance: {
        type: String,
        required: true
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
