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

describe('trainee/', () => {
	it('Should get a staus of 200', (done) => {
		chai.request('http://localhost:4000').get('/trainee/').end((err, res) => {
			res.should.have.status(200);
			done();
		});
	});
});


// MOCK DATA
let addUser = {
	'trainee_email': 'test@test.test',
	'trainee_password': 'password123',
	'trainee_start_date': "Wed May 01 2019 12:00:00 GMT+0100 (GMT Summer Time)",
	'trainee_end_date': "Wed Jul 24 2019 00:00:00 GMT+0100 (GMT Summer Time)",
	'trainee_fname': 'John',
	'trainee_lname': 'Adams',
	'trainee_bursary_amount': '30',
	'bursary': 'True',
	'trainee_bench_start_date': "Thur Jun 25 2019",
	'trainee_bench_end_date': "Wed Jul 31 2019",
	'trainee_days_worked': '1',
	'bank_holiday': 'true'
};

let addUser2 = {
	'trainee_email': 'test2@test.test',
	'trainee_password': 'password123',
	'trainee_start_date': "Wed May 01 2019 12:00:00 GMT+0100 (GMT Summer Time)",
	'trainee_end_date': "Wed Jun 24 2019 00:00:00 GMT+0100 (GMT Summer Time)",
	'trainee_fname': 'John',
	'trainee_lname': 'Adams',
	'trainee_bursary_amount': '0',
	'bursary': 'False',
	'trainee_bench_start_date': "Thur Jun 25 2019",
	'trainee_bench_end_date': "Wed Aug 31 2019",
	'trainee_days_worked': '1',
	'bank_holiday': 'true'
};

let adminUser = {
	
}

let newPassword = {
	'trainee_password': 'password' 
}

let updateUser = {
	'trainee_email': 'test@test.test',
	'trainee_password': 'password123',
	'trainee_fname': 'John',
	'trainee_lname': 'Adams',
	'trainee_account_no': '19982350',
	'trainee_sort_code': '090921',
	'trainee_bank_name': 'Bank'
};

let updateDates = {
	'trainee_start_date': "Wed May 01 2019 12:00:00 GMT+0100 (GMT Summer Time)",
	'trainee_end_date': "Wed Jul 24 2019 00:00:00 GMT+0100 (GMT Summer Time)",
	'trainee_bench_start_date': "Thur Jun 25 2019",
	'trainee_bench_end_date': "Wed Aug 31 2019"
}

let updateBursary = {
	'trainee_bursary_amount': '50',
	'bursary': 'true'
}

let profilePic = {
    'imageName':'testimg',
    'imageData':'../Pizza.jpg'
}

describe('Testing profile picture upload', () => {
	it('Should get a status of 200', (done) => {
		chai.request('http://localhost:4000/').post('/uploadmulter').attach( 'Pizza.jpg', './Pizza.jpg').end((err, res) => {
			if (err) {
                console.log(err);
            } else expect(res.status).to.equal(200);
            done();
		});
	});
});

/*describe('uploadmulter/', () => {
	it('Should get a staus of 200', (done) => {
		chai.request('http://localhost:4000').get('/trainee/').end((err, res) => {
			res.should.have.status(200);
			done();
		});
	});
});*/