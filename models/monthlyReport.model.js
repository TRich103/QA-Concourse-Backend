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

var monthly = module.exports = mongoose.model('Monthly.Report', MonthlySchema);

monthly.find({}, function(err, reports){
  if(!err){
      reports.map(report => {
          if(report.approvedBy === undefined){
              report.approvedBy = CryptoJS.AES.encrypt("", '3FJSei8zPx').toString();
          }
          if(report.financeApprove === undefined){
              report.financeApprove = CryptoJS.AES.encrypt("", '3FJSei8zPx').toString();
          }
        let stat = CryptoJS.AES.decrypt(report.status, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
        if(stat !== "FinanceApproved"){
          if (report.reportTrainees.length > 0) {
            report.reportTrainees.map(trainees => {
              if(trainees.monthly_expenses.length > 0){
                trainees.monthly_expenses.map(expense => {
                  if(expense.status === undefined){
                    expense.status = expense.status = CryptoJS.AES.encrypt("Pending", '3FJSei8zPx').toString();
                  }
                });
              }
            });
          }
          report.markModified('reportTrainees');
          report.save();
        }
        else if(stat === "FinanceApproved"){
          if (report.reportTrainees.length > 0) {
            report.reportTrainees.map(trainees => {
              if(trainees.monthly_expenses.length > 0){
                trainees.monthly_expenses.map(expense => {
                  if(expense.status === undefined){
                    expense.status = expense.status = CryptoJS.AES.encrypt("Approved", '3FJSei8zPx').toString();
                  }
                });
              }
            });
          }
          report.markModified('reportTrainees');
          report.save();
        }
      })
  }
  else{
      throw err;
  }
})