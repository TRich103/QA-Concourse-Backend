'use strict'

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
var sortcode1 = {
	'sort_code' : '090921' 
};
var sortcode2 = {
	'sort_code' : '999999'
};
var sortcode3 ={
	'sort_code' : '090922'
};

var newbank = {
	'SortCode' : '420420',
	'BankName' : 'test',
	'Branch' : 'test'
};
var newbank2 = {
	'BankName' : 'test',
	'Branch' : 'test'
};

describe('test bank functions', () =>{
	it('test find bank function, expect similar', (done)=>{
		chai.request('http://localhost:4000').post('/trainee/findBank').send(sortcode3).end((err, res) =>{
			if(res.status== '200'){
				console.log(res.body);
				assert(res.body.Match === false, "Match found");
				assert(res.body.OtherCodes[0] === "090921", "Similar sort codes not found");
				done();
			}
			else{
				console.log('test failed: ' + res.status);
				throw new Error(err);
			}
		})
	})
	it('test find bank function, expect no similar', (done)=>{
		chai.request('http://localhost:4000').post('/trainee/findBank').send(sortcode2).end((err, res) =>{
			if(res.status== '200'){
				console.log(res.body);
				assert(res.body.Match === false, "Match found");
				assert(res.body.OtherCodes[0] === "No similar sort codes found", "Similar sort codes found");
				done();
			}
			else{
				console.log('test failed: ' + res.status);
				throw new Error(err);
			}
		});
	});
	it('test find bank function, expect find', (done) =>{
		chai.request('http://localhost:4000').post('/trainee/findBank').send(sortcode1).end((err, res) =>{
			if(res.status == '200'){
				console.log(res.body);
				assert(res.body.Match === true, "Match not found");
				done();
			}
			else{
				console.log('test failed: ' + res.status);
				throw new Error(err);
			}
		});
	});
	it('test add bank', (done)=>{
		chai.request('http://localhost:4000').post('/trainee/addBank').send(newbank).end((err, res) =>{
			if(res.status == '200'){
				console.log(res.body);
				assert.equal('Sortcode added successfully', res.body.bank, "Added successfully");
				done();
			}
			else{
				console.log('test failed: ' + res.status);
				throw new Error(err);
			}
		});
	});
	it('test add bank, expect fail', (done)=>{
		chai.request('http://localhost:4000').post('/trainee/addBank').send(newbank2).end((err, res) =>{
			if(res.status == '205'){
				console.log(res.body);
				assert.deepEqual('Adding new Sortcode failed', res.body.bank, "Didnt add, as expected");
				done();
			}
			else{
				console.log('test failed: ' + res.status);
				throw new Error(err);
			}
		});
	});
})
