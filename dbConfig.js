const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const dbName='bookmyshow';
const dbUrl = `mongodb+srv://aks-admin:1311wesat@cluster0.jfg1m.mongodb.net/${dbName}`
module.exports ={dbUrl,mongodb,MongoClient,dbName};