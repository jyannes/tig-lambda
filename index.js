// MIS3502 - Project 4
// Created by: Jake Yannes & Mike Hughes
// Spring 2023


// declarations *****************************************
const qs = require('qs'); //for parsing URL encoded data
const axios = require('axios'); // for calling another API
const base64 = require('js-base64'); // encode / decode
const mysql = require('sync-mysql');  //for talking to a database


// Put your database connection information here.
const dboptions = {
  'user' : 'mis256',
  'password' : 'FOT78Z',
  'database' : 'mis256cherry',
  'host' : 'dataanalytics.temple.edu'
};

const connection = new mysql(dboptions);

// Add your project-specific features and functions here.

const features = [
"Issue a GET against ./auth and provide a username and password. The API will respond with a JSON object containing all the user information except the password.",
"Issue a POST against ./users to create a new user record. You must provide the following keys: username, password, email. The API will respond with the userid of the newly created record.",
"Issue a GET against ./preferences for a specific user. You must provide the following key: userid. The API will respond with a JSON object containing the preferences information for the provided user.",
"Issue a POST against ./preferences to create or update the preferences for a specific user. You must provide the following keys: userid, preference_key, preference_value. The API will respond with a JSON object containing the updated preferences information for the provided user.",
"Issue a GET against ./itineraries for a specific user. You must provide the following key: userid. The API will respond with a JSON object containing the itineraries information for the provided user.",
"Issue a POST against ./itineraries to create a new itinerary record for a specific user. You must provide the following keys: userid, destination, start_date, end_date, and notes (may be an empty string). The API will respond with the itineraryid of the newly created record.",
"Issue a PATCH against ./itineraries to update an existing itinerary record. You must provide the following keys: destination, start_date, end_date, and notes (may be an empty string). The API will respond with the updated itinerary information.",
"Issue a DELETE against ./itineraries to delete a specific itinerary record. You must provide the following key: itineraryid. The API will respond with a confirmation message indicating the successful deletion of the itinerary record.",
"This API belongs to Jake Yannes & Mike Hughes"
];

// Supporting Functions

// Authentication
const authenticateUser = (res, query) => {
  const username = query.username;
  const password = query.password;

  const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  const result = connection.query(sql);

  if (result.length > 0) {
    res.statusCode = 200;
    res.body = JSON.stringify(result[0]);
  } else {
    res.statusCode = 400;
    res.body = JSON.stringify("Invalid username or password.");
  }
  return res;
};

// Create a new user
const createUser = (res, body) => {
  const username = body.username;
  const password = body.password;
  const first_name = body.firstname;
  const last_name = body.lastname;
  const email = body.email;

  const sql = `INSERT INTO users (username, first_name,last_name,password, email) VALUES ('${username}','${first_name}','${last_name}' ,'${password}', '${email}')`;
  const result = connection.query(sql);

  res.statusCode = 200;
  res.body = JSON.stringify({ user_id: result.insertId });
  return res;
};

// Get preferences for a user
const getPreferences = (res, query) => {
  const user_id = query.user_id;

  const sql = `SELECT * FROM preferences WHERE user_id = ${user_id}`;
  const result = connection.query(sql);

  res.statusCode = 200;
  res.body = JSON.stringify(result);
  return res;
};

// Update preferences for a user
const updatePreferences = (res, body) => {
  const user_id = body.user_id;
  const preference_key = body.preference_key;
  const preference_value = body.preference_value;

  const sql = `INSERT INTO preferences (user_id, preference_key, preference_value) VALUES (${user_id}, '${preference_key}', '${preference_value}') ON DUPLICATE KEY UPDATE preference_value = '${preference_value}'`;
  const result = connection.query(sql);

  res.statusCode = 200;
  res.body = JSON.stringify({ message: "Preferences updated." });
  return res;
};

// Get itineraries for a user
const getItineraries = (res, query) => {
  const user_id = query.user_id;

  const sql = `SELECT * FROM itineraries WHERE user_id = ${user_id}`;
  const result = connection.query(sql);

  res.statusCode = 200;
  res.body = JSON.stringify(result);
  return res;
};

// Create a new itinerary
const createItinerary = (res, body) => {
  const user_id = body.user_id;
  const destination = body.destination;
  const start_date = body.start_date;
  const end_date = body.end_date;
  const notes = body.notes;

  const sql = `INSERT INTO itineraries (user_id, destination, start_date, end_date, notes) VALUES (${user_id}, '${destination}', '${start_date}', '${end_date}', '${notes}')`;
  const result = connection.query(sql);

  res.statusCode = 200;
  res.body = JSON.stringify({ itineraryid: result.insertId });
  return res;
};

// Update an existing itinerary
const updateItinerary = (res, body) => {
  const itineraryid = body.itineraryid;
  const destination = body.destination;
  const start_date = body.start_date;
  const end_date = body.end_date;
  const notes = body.notes;

  const sql = `UPDATE itineraries SET destination = '${destination}', start_date = '${start_date}', end_date = '${end_date}', notes = '${notes}' WHERE itinerary_id = ${itineraryid}`;
  const result = connection.query(sql);

  res.statusCode = 200;
  res.body = JSON.stringify({ message: "Itinerary updated." });
  return res;
};

// Delete a specific itinerary
const deleteItinerary = (res, query) => {
  const itineraryid = query.itineraryid;

  const sql = `DELETE FROM itineraries WHERE itinerary_id = ${itineraryid}`;
  const result = connection.query(sql);

  res.statusCode = 200;
  res.body = JSON.stringify({ message: "Itinerary deleted." });
  return res;
};

// My Routing Function **********************************

let myRoutingFunction = (res, method, path, query, body) => {
  // conditional statements go here.
  // look at the path and method and return the output from the
  // correct supporting function.

  // Your project-specific routes and methods go here.
  if (method === "GET" && path === "auth") {
    return authenticateUser(res, query);
  } 
  
  if (method === "POST" && path === "users") {
    return createUser(res, body);
  } 
  
  if (method === "GET" && path === "preferences") {
    return getPreferences(res, query);
  } 
  
  if (method === "POST" && path === "preferences") {
    return updatePreferences(res, body);
  } 
  
  if (method === "GET" && path === "itineraries") {
    return getItineraries(res, query);
  } 
  
  if (method === "POST" && path === "itineraries") {
    return createItinerary(res, body);
  } 
  
  if (method === "PATCH" && path === "itineraries") {
    return updateItinerary(res, body);
  } 
  
  if (method === "DELETE" && path === "itineraries") {
    return deleteItinerary(res, query);
  }

  return res;
};

// event handler ****************************************

// Students should not have to change the code here.
// Students should be able to read and understand the code here.


exports.handler = async (request) => {

	// identify the method (it will be a string)
	let method = request["httpMethod"];
	
	// identify the path (it will also be a string)
	let fullpath = request["path"];
	
	// we clean the full path up a little bit
	if (fullpath == undefined || fullpath == null){ fullpath = ""};
	let pathitems = fullpath.split("/");
	let path = pathitems[2];
	if (path == undefined || path == null){ path = ""};
	
	// identify the querystring ( we will convert it to 
	//   a JSON object named query)
	let query = request["queryStringParameters"];
	if (query == undefined || query == null){ query={} };
	
	// identify the body (we will convert it to 
	//   a JSON object named body)
	let body = qs.parse(request["body"]);
	if (body == undefined || body == null){ body={} };

	// Create the default response object that will include 
	// the status code, the headers needed by CORS, and
	// the string to be returned formatted as a JSON data structure.
    let res = {
        'statusCode': 400,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true  
        },
        'body': JSON.stringify("Feature not found."),
    };

	// run all the parameters through my routing function
	// and return the result
    return myRoutingFunction(res,method,path,query,body);
    
    //this is an example of Shafer testing one specific function:
    //body={"username":"adam","password":"Password123","email":"adam@email.com"}
    //return makeUser(res,body)
};
