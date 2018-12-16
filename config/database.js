//Set up mongoose connection
console.log('in db config');
const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost/c2t';
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;
/*const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));*/
