'use strict'
let trainee = require('../models/trainee.model.js');
let report = require('../models/monthlyReport.model.js');
var CryptoJS = require("crypto-js");
var expect = require('chai').expect,
	request = require('supertest'),
	should = require('chai').should(),
	//should = require('should'),
	server = require('../server.js');
var chai = require('chai');
var chaiHttp = require('chai-http');
var assert = require('assert'),
	http = require('http');
chai.use(chaiHttp);

// BEFORE TESTING
describe('server', function() {
	before(function () { 
		server.listen(4000);
	});
	after(function () {
		server.close();
	})
})

//Test data
var month = {
	'month' : 'June 2019' 
}
var future_month1 = {
	'month' : 'June 3002'
}
var future_month2 ={
	'month': 'June 2999'
}
var past_month = {
	'month' : 'June 1996'
}
var future_month3 = {
	'month': 'July 2019'
}
var report_updater = {
	'month' : 'June 2019',
	'user_role': 'admin',
	'approvedBy':'adamAdmin'
}
var report_updater2 = {
	'month' : 'June 2019',
	'user_role': 'finance',
	'approvedBy':'adamAdmin',
	'financeApprove':'FrannyFinance'
}
var report_updater3 = {
	'month': 'June 2019',
	'user_role': 'pending'
}
var report_updater4 = {
	'month': 'June 3000',
	'user_role': 'admin',
	'approvedBy':'adamAdmin',
	'financeApprove':' '
}
var report_updater5 = {
	'month': 'June 3050',
	'user_role': 'pending',
	'approvedBy':'adamAdmin',
	'financeApprove':' '
}

let status_pending = {
	'month':'July 2019',
	'user_role':'pending',
	'approvedBy':'Adam Admin',
	'financeApprove':'Franny Finance'
}
let status_finance = {
	'month':'July 2019',
	'user_role':'finance',
	'approvedBy':'Adam Admin',
	'financeApprove':'Franny Finance'
}
let status_admin = {
	'month':'July 2019',
	'user_role':'admin',
	'approvedBy':'Adam Admin'
}
let new_month ={
	'month':'August 2019'
}


describe('test get specific report functions', () =>{
	it('test  function, expect success', (done) =>{
		chai.request('http://localhost:4000').post('/trainee/getMonthlyReport').send(future_month3).end((err, res) =>{
			if(res.status == '200'){
				assert.deepEqual("July 2019", res.body.month, "report not found");
				done();
			}
			else{
				console.log('test failed: ' + res.status);
				throw new Error(err);
			}
		})
	})
	it('test function, expect failure', (done)=>{
		chai.request('http://localhost:4000').post('/trainee/getMonthlyReport').send(future_month2).end((err, res)=>{
			if(res.status == '200'){
				assert.deepEqual("no report", res.body, "Report found when it wasn't supposed to be");
				done();
			}
			else{
				console.log('test failed: ' + res.status);
				throw new Error(err);
			}
		})
	})
})
describe('test create new report function', () =>{
	it('test function, get cannot create', (done) =>{
		chai.request('http://localhost:4000').post('/trainee/monthlyReport').send(past_month).end((err, res)=>{
			if(res.status == '200'){
				assert.deepEqual("Report cannot be created", res.body, "The report was created when it wasn't supposed to be");
				done();
			}
			else{
				console.log('test failed: ' + res.status);
				throw new Error(res.status + " http code");
			}
		})
	})
	it('test function, get success', (done) =>{
		chai.request('http://localhost:4000').post('/trainee/monthlyReport').send(future_month3).end((err, res) =>{
			if(res.status == '200'){
				assert.deepEqual(res.body, res.body);
				done();
			}
			else{
				console.log('test failed: ' + res.status);
				throw new Error(res.status + " http code");
			}
		});
	});
	it('test function, create new', async(done)=>{
		chai.request('http://localhost:4000').post('/trainee/monthlyReport').send(new_month).end((err, res) =>{
			if(res.status =='200'){
				assert.deepEqual("Successfully Updated", res.body, "The report was not created")
				done();
			}
			else{
				console.log('test failed: ' + res.status);
				throw new Error(res.status + " http code");
			}
		})
	})
	it('test function, fail to update', async(done) =>{
		chai.request('http://localhost:4000').post('/trainee/monthlyReport').send(future_month3).end((err, res) =>{
			if(res.status =='200'){
				assert.deepEqual("Report cannot be updated", res.body, "Function updated when it wasn't supposed to");
				done();
			}
			else{
				console.log('test failed: ' + res.status);
				throw new Error(res.status + " http code");
			}
		})
	});
})
describe('test update status and set pending', ()=>{
	it('test function, cannot find report', (done)=>{
		chai.request('http://localhost:4000').post('/trainee/monthlyReport/updateStatus').send(report_updater5).end((err, res) =>{
			if(res.status == '200'){
				
				assert.deepEqual("Unable to find a monthly report", res.body, "Report got found when it shoudln't have been");
				done();
			}
			else{
				console.log('test failed: ' + res.status);
				throw new Error(res.status + " http code");
			}
		})
	})
	it('test function, cannot find report to reset status', (done)=>{
		chai.request('http://localhost:4000').post('/trainee/monthlyReport/updateStatus').send(report_updater5).end((err, res) =>{
			if(res.status == '200'){
		
				assert.deepEqual("Unable to find a monthly report", res.body, "Found a monthly report when it wasn't supposed to");
				done();
			}
			else{
				console.log('test failed: ' + res.status);
				throw new Error(res.status + " http code");
			}
		})
	})
	it('test function, failure on first', (done)=>{
		chai.request('http://localhost:4000').post('/trainee/monthlyReport/updateStatus').send(report_updater3).end((err, res) =>{
			if(res.status =='200'){
				assert.deepEqual(res.body, res.body, "Unable to update report");
				done();
			}
			else{
				console.log('test failed: ' + res.status);
				throw new Error(res.status + " http code");
			}
		})
	})
	it('test function, get success on both (finance)', async(done)=>{
		chai.request('http://localhost:4000').post('/trainee/monthlyReport/updateStatus').send(report_updater).end((err, res) =>{
			if(res.status == '200'){
				assert.deepEqual(res.body, res.body, "Report did not update");
				chai.request('http://localhost:4000').post('/trainee/monthlyReport/setPending').send(report_updater2).end((err, res) =>{
					if(res.status=='200'){
						assert.deepEqual("Sucessfully updated ", res.body, "Report could not be set to pending");
						done();
					}
					else{
						console.log('test failed: ' + res.status);
						throw new Error(res.status + " http code");
					}
				})
			}
			else{
				console.log('test failed: ' + res.status);
				throw new Error(res.status + " http code");
			}
		})
	})
	it('test function, get success on both (admin)', (done)=>{
		chai.request('http://localhost:4000').post('/trainee/monthlyReport/updateStatus').send(report_updater).end((err, res) =>{
			if(res.status == '200'){
				assert.deepEqual(res.body, res.body, "Report did not update");
				
				chai.request('http://localhost:4000').post('/trainee/monthlyReport/updateStatus').send(report_updater2).end((err, res) =>{
					if(res.status=='200'){
						
						assert.deepEqual("Unable to find a monthly report", res.body, "Unable to update report");
					}
					else{
						console.log('test failed: ' + res.status)
						throw new Error(res.status + " http code")
					}
				})
				chai.request('http://localhost:4000').post('/trainee/monthlyReport/updateStatus').send(report_updater).end((err, res) =>{
					if(res.status=='200'){
					
						assert.deepEqual(res.body, res.body, "Report could not be set to pending");
						done();
					}
					else{
						console.log('test failed: ' + res.status);
						throw new Error(res.status + " http code");
					}
				})
			}
			else{
				console.log('test failed: ' + res.status);
				throw new Error(res.status + " http code");
			}
		})
	})
})

describe('update status and revert back', ()=>{
	it('test function, finds report', (done)=>{
		chai.request('http://localhost:4000').post('/trainee/getMonthlyReport').send(future_month3).end((err, res) =>{
			if(res.status == '200'){
				
				assert.equal(res.status, res.status,"Found Report");
				done();
			}
			else{
				console.log('test failed: ' + res.status);
				throw new Error(res.status + " http code");
			}
		})
	})
	
	it('test function, reverts status back to Pending', (done)=>{
		chai.request('http://localhost:4000').post('/trainee/MonthlyReport/updateStatus').send(status_pending).end((err, res) =>{
			if(res.status == '200'){
				assert.equal('Sucessfully updated ', 'Sucessfully updated ');
				done();
			}
			else{
				console.log('test failed: ' + res.status + res.body);
				throw new Error(res.status + " http code");
			}
		})
	})
	it('test function, reverts status back to Finance', (done)=>{
		chai.request('http://localhost:4000').post('/trainee/MonthlyReport/updateStatus').send(status_admin).end((err, res) =>{
			if(res.status == '200'){
				assert.equal('Sucessfully updated ', 'Sucessfully updated ');
				done();
			}
			else{
				console.log('test failed: ' + res.status + res.body);
				throw new Error(res.status + " http code");
			}
		})
	})
	
	it('test function, reverts status back to Finance', (done)=>{
		chai.request('http://localhost:4000').post('/trainee/MonthlyReport/updateStatus').send(status_finance).end((err, res) =>{
			if(res.status == '200'){
				assert.equal('Sucessfully updated ', 'Sucessfully updated ');
				done();
			}
			else{
				console.log('test failed: ' + res.status + res.body);
				throw new Error(res.status + " http code");
			}
		})
	})

	it('test function, reverts status back to Finance', async(done)=>{
		chai.request('http://localhost:4000').post('/trainee/MonthlyReport/updateStatus').send(status_finance).end((err, res) =>{
			if(res.status == '200'){
				assert.equal('Sucessfully updated ', 'Sucessfully updated ');
				done();
			}
			else{
				console.log('test failed: ' + res.status + res.body);
				throw new Error(res.status + " http code");
			}
		})
	})
});

