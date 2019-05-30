import * as mongodb from 'mongodb';
const assert = require('assert');

const client = new mongodb.MongoClient('mongodb://liam:90%400fB32@74.215.40.210:27017');
client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
});

export { client };