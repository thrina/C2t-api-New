var express = require('express'); 
var router = express.Router(); 
var mongo = require('mongodb'); 
var assert = require('assert'); 
var JSON = require('circular-json'); 
var ObjectID = require('mongodb').ObjectID;

var url = "mongodb://localhost:27017/";


/* GET users listing. */
router.get('/', function(req, res, next) {
res.header('Access-Control-Allow-Origin', "*"); 
res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); 
res.header('Access-Control-Allow-Headers', 'Content-Type'); 

res.send(getUsersData()); 
}); 

router.get('/getuser', function (req, res, next) {
	var userDetails = req.body;
var resultArray = []; 
mongo.connect(url,  {useNewUrlParser:true }, function(err, client) {
if (err) {
console.log("connection not established"); 
}
else {
console.log("connection established...."); 
}
// assert is from node js used to check errors.
// assert.equal(null, err);
var dbName = client.db("c2t"); 
	var users = []; 
	var allUsers = [];
	if (userDetails && userDetails._id) {
		allUsers = dbName.collection('users').find( {"_id":ObjectID(userDetails._id)});
	} else {
 		allUsers = dbName.collection('users').find( {}); 
	}
console.log(allUsers, "kkkkkkkkkkkkkkk"); 
allUsers.forEach(element =>  {
// assert.equal(null,err);
users.push(JSON.stringify(element)); 

}, function() {
client.close(); 
res.send(JSON.stringify(users)); 
}); 
})

}); 

function getUsersData() {
var jsonObj =  {
"rows":[ {"userName":"pavan"},  {"userName":"vijay"}, 
]
  }
return jsonObj; 

}

router.post('/login', function (req, res, next) {
mongo.connect(url,  {useNewUrlParser:true }, function (err, client) {
if (err) {
console.log("connection not established"); 
}else {
		console.log("connection established...."); 
var dbName = client.db("c2t"); 
var users = []; 
var checkExist = req.body; 

var allUsers = dbName.collection('users').find(checkExist); 
console.log(typeof allUsers, "getting data"); 


allUsers.forEach(element =>  {
// assert.equal(null,err);
users.push(JSON.stringify(element)); 

}, function() {
client.close(); 
if (users.length == 0) {
res.send( {"failureMesssage":"Invalid credentials"}); 
}
else {
res.send( {"rowData":users.toString(), "successMessage":"success"}); 
}
}); 

}
})
})



router.post('/signup', function (req, res, next) {
	console.log(req.body, "req obj"); 
	res.header('Access-Control-Allow-Origin', "*"); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS'); 
	mongo.connect(url,  {useNewUrlParser:true }, function (err, client) {
		if (err) {
		console.log("connection not established"); 
	}else {
			console.log("connection established...."); 
	var dbName = client.db("c2t"); 
	const INSERT_RECORD = req.body; 
	var allUsers = dbName.collection('users').insertOne(INSERT_RECORD); 
	client.close(); 
	res.status(200).send( {'messsage':'Registered successfully'}); 
	}
})
})

router.put('/updateuser', function (req, res, next) {
	console.log(req.body, "req obj"); 
	res.header('Access-Control-Allow-Origin', "*"); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); 
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	mongo.connect(url, { useNewUrlParser: true }, function (err, client) {
		
		if (err) {
			console.log("connection not established");
		} else {
			console.log("connection established....");
			var dbName = client.db("c2t"); 
			const UPDATE_RECORD = JSON.parse(JSON.stringify(req.body)); 
			console.log("UPDATE_RECORD", UPDATE_RECORD);
			
			delete req.body._id;
			var updatUser = dbName.collection('users').updateOne({"_id":ObjectID(UPDATE_RECORD._id)}, {$set:req.body}, function(err, result){
				if (err) {
					console.log('Error updating object: ' + err);
					client.close(); 
					res.send({ 'error': 'An error has occurred' });
				} else {
					console.log('' + result + ' document(s) updated');
					client.close(); 
					res.status(200).send( {"data":result,'messsage':'success'}); 
				}
				}); 
		}
	})
})


module.exports = router; 