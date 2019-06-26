'use strict'
let user = require('../models/staff.js');
var CryptoJS = require("crypto-js");
var expect = require('chai').expect,
	request = require('supertest'),
	should = require('chai').should(),
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

describe('admin/', () => {
	it('Should get a staus of 200', (done) => {
		chai.request('http://localhost:4000').get('/admin/').end((err, res) => {
			res.should.have.status(200);
			done();
		});
	});
});
//Mock Data to be used for test 
let addStaff= {
	'email': 'Flatliner0101@aol.com',
	'password': 'password123',
	'fname': 'Johnny',
	'role': 'admin',
	'lname': 'Adams',
	'status':'Active'
};
let updateStaff = {
	'email': 'Flatliner0101@aol.com',
	'fname': 'John',
	'lname': 'Adams'
};

//Testing Begins

describe('admin tests', () => {
	var staffId;
	var staffEmail;
	
	before((done) => { 
		chai.request('http://localhost:4000').post('/admin/addUser').set('content-type', 'application/json').send(addStaff).end((err, res) => {
			 if (res.status == '200'){
			 	console.log('Staff Account has been created');
				chai.request('http://localhost:4000').get('/admin/').end((err, res) => {
					let i = 0;
						while(i < res.body.length){
							if(res.body[i].email == addStaff.email){
								console.log("email : "+ res.body[i].email);
								console.log("id : "+res.body[i]._id);
								staffId = res.body[i]._id;
								staffEmail = res.body[i].email;
								break;
							}
						i++;
					}
					done();
				});
			 }
			 else if(res.status == '205'){
				 console.log('email already in use or unable to save correctly');
				 throw new Error('Expected 200 but got 205 meaning email in use or save issue');
			 }
			 else{
			 	 throw new Error(`Expected 200 but got ${res}. error is ${err}`);
			 }
		});
	});
	
	it('add Staff user', (done) =>{
		console.log('Staff Added succesfully');
		done();
	});
	
	it('update staff user details', (done) => {
		chai.request('http://localhost:4000').post('/admin/update-staff/' + staffId).send(updateStaff).end((err, res) => {
			if (res.status == '200'){
				done();
			}
			else if (res.status == '404' || '400'){
				console.log(res.body);
			}
			else {
				console.log('test failed');
				throw new err();
			}
			done();
		});
	});
	
	it('update Staff user', (done) =>{
		console.log(addStaff.fname + " has changed to " + updateStaff.fname );
		done();
	});
	
});

