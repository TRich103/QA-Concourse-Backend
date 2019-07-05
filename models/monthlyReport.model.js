const mongoose = require('mongoose');


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
