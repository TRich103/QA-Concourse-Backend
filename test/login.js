'use strict'
let user = require('../models/staff.js');
var CryptoJS = require("crypto-js");
var existingemail = "sZjrgWgK7vj49jcWVAw8e8KskrOOIcbKFvKYboWdUuY="; //set the email of an existing trainee here
var existingStaffEmail = "4QWRatu2iG4jAL95IVDX3wxnEt9ruGQHMb91T/poKtA="; //set the email of an existing user here
var existingId = "5cc9dc038faf56a0a3b16e38"; //set the id of an existing trainee here
var staffExistingId = "5cdd6dbf4b17158d999ed680"; //set the id of an existing staff user here

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

let addUser = {
	"username" : "adamadmin@qa.com",
	"password" : "adam"

}

let Adam = {
	"staff_email" : "adamadmin@qa.com"
}

let wrongPass = {
	"username" : "adamadmin@qa.com",
	"password" : "adamwrong"
}


let wrongUser = {
	"username" : "wrongadamadmin@qa.com",
	"password" : "adam"
}

let newPass = {
	"previous":"adam",
	"password": "adam"
}

describe('login', () => {
	it('login success', (done) =>{
		addUser.username = 
		chai.request('http://localhost:4000').post('/auth/login').set('content-type', 'application/json').send(addUser).end((err, res) => {
			if (res.status == '200'){
				assert.deepEqual(res.body.user.role, 'admin', "Login is successful")
				done();
			}
			else {
				throw new Error(res.status);
			}
		});
	});

	it('wrong password', (done) =>{
		chai.request('http://localhost:4000').post('/auth/login').set('content-type', 'application/json').send(wrongPass).end((err, res) => {
			if (res.status == '401'){
				console.log(res.body);
				done();
			}
			else {
				throw new Error(err);
			}
		});
	});
	it('wrong username', (done) =>{
		chai.request('http://localhost:4000').post('/auth/login').set('content-type', 'application/json').send(wrongUser).end((err, res) => {
			if (res.status == '401'){
				console.log(res.body);
				done();
			}
			else {
				throw new Error(err);
			}
		});
	});
});

describe('reset-password', ()=>{
	it('set new password', (done) =>{
		chai.request('http://localhost:4000').post('/admin/update-mypassword-staff/5d08ed7db35b17201428a6eb').set('content-type', 'application/json').send(newPass).end((err, res)=>{
			if(res.status == '200'){
				assert.deepEqual(res.body, "Password updated!", "Password update works");
				done();
			}
			else{
				throw new Error("Http error: " + res.status);
			}
		})
	});
});