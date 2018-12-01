var express = require('express'); 
var router = express.Router(); 
var mongo = require('mongodb'); 
var assert = require('assert'); 
var JSON = require('circular-json'); 

var url = "mongodb://localhost:27017/";


/* GET users listing. */
router.get('/', function(req, res, next) {
res.header('Access-Control-Allow-Origin', "*"); 
res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); 
res.header('Access-Control-Allow-Headers', 'Content-Type'); 

res.send(getUsersData()); 
}); 

router.get('/get-users', function(req, res, next) {
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
var allUsers = dbName.collection('demo').find( {}); 
console.log(allUsers, "kkkkkkkkkkkkkkk"); 

allUsers.forEach(element =>  {
// assert.equal(null,err);
users.push(JSON.stringify(element)); 

}, function() {
client.close(); 
res.send(JSON.stringify(users)); 
}); 
})

// res.send(getUsersData());
}); 

router.post('/updateUser', function(req, res, next) {

res.send("post"); 
}); 

function getUsersData() {
let jsonObj =  {
"rows":[ {"userName":"pavan"},  {"userName":"vijay"}, 
]
  }
return jsonObj; 

}

module.exports = router; 
