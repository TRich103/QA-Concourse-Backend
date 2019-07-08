const mongoose = require('mongoose');
var CryptoJS = require("crypto-js");


const MonthlySchema = new mongoose.Schema({
  month: { 
  type: String, 
  required: true, 
  unique: true 
  },
  reportTrainees: {
    type: Array
  },
  status: {
    type: String,
    //enums ['PendingApproval', 'AdminApproved', 'FinanceApproved']
    required: true
  },
  approvedBy: {
	  type:String
  },
  financeApprove: {
	  type:String
  }
 }
);

module.exports = mongoose.model('Monthly.Report', MonthlySchema);

let rep = module.exports = mongoose.model('Monthly.Report', MonthlySchema);

rep.find({}, function(err, reports){
  console.log("reaches here");
  if(!err){
      reports.map(report => {
          if(report.approvedBy === undefined){
              report.approvedBy = CryptoJS.AES.encrypt("", '3FJSei8zPx').toString();
          }
          if(report.financeApprove === undefined){
              report.financeApprove = CryptoJS.AES.encrypt("", '3FJSei8zPx').toString();
          }
          report.save();
      })
  }
  else{
      throw err;
  }
})