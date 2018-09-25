'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const fs = require('fs');

let options = {};

// connect to local DB if running offline
if (process.env.IS_OFFLINE) {
  options = {
    region: 'us-west-2',
    endpoint: 'http://localhost:8000',
  };
}


const docClient = new AWS.DynamoDB.DocumentClient(options);
const categories = JSON.parse(fs.readFileSync('./data/categories.json', 'utf8'));

console.log("Importing movies into DynamoDB. Please wait.");

categories.forEach((category) => {
    var params = {
        TableName: "Categories",
        Item: {
          "name":  category.name
        }
    };
    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add ", category.name, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", category.name);
       }
    });
});


module.exports = docClient;
