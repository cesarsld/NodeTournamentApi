import * as mongodb from 'mongodb';
const assert = require('assert');

const client = new mongodb.MongoClient(process.env.MONGO_URL);
client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
});

export { client };