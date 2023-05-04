const pool = require("../db");
const jwt = require('jsonwebtoken');
const jwtSecret = 'itsworking';
//create a reqest (done)
//editrequest (done)
//delete request (done)
//get all requests (done)

module.exports={
  //create a new request
  CreateRequest: async (req, res) => {
    try {
      const {destination_name, source_name, is_smoking_allowed, is_all_female, notes} = req.body;
  
      // Retrieve the token from the request header
      const token = req.headers.authorization.split(' ')[1];
  
      // Verify the JWT token and extract the member_id
      const decoded = jwt.verify(token, jwtSecret);
      const member_id = decoded.userId;
      console.log(`The extracted member_id from the JWT token is: ${member_id}`);
      console.log('Decoded JWT token:', decoded);
  
      // Insert the destination details into the destination table
      const destinationData = await pool.query(
        `INSERT INTO destination (d_name, source_name)
         VALUES ($1, $2)
         RETURNING destination_id`,
        [destination_name, source_name]
      );
      const destination_id = destinationData.rows[0].destination_id;
  
      // Insert the preference details into the preference table
      const preferenceData = await pool.query(
        `INSERT INTO preference (is_smoking_allowed, is_all_female, notes, member_id)
         VALUES ($1, $2, $3, $4)
         RETURNING preference_id`,
        [is_smoking_allowed, is_all_female, notes, member_id]
      );
      const preference_id = preferenceData.rows[0].preference_id;
  
      // Set the status_id to 1 (PENDING) since the request is being created
      const status_id = 1;
  
      // Insert the request details into the request table
      const requestData = await pool.query(
        `INSERT INTO request (member_id, destination_id, preference_id, status_id, created_on, request_token)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5)
         RETURNING request_id`,
        [member_id, destination_id, preference_id, status_id, '']
      );
      const request_id = requestData.rows[0].request_id;
  
      // Create a JWT token with the request_id as the payload
      const requestToken = jwt.sign({requestId: request_id}, jwtSecret);
  
      // Update the request_token column in the request table with the generated JWT token
      await pool.query(
        `UPDATE request SET request_token = $1 WHERE request_id = $2`,
        [requestToken, request_id]
      );
  
      res.status(201).json({
        message: 'Request created successfully',
        request_id: request_id,
        token: requestToken
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating request');
    }
  },

  // Edit a request
EditRequest: async (req, res) => {
  try {
    const {destination_name, source_name, is_smoking_allowed, is_all_female, notes} = req.body;

    // Retrieve the token from the request header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token and extract the request_id
    const decoded = jwt.verify(token, jwtSecret);
    const request_id = decoded.requestId;
    console.log(`The extracted request_id from the JWT token is: ${request_id}`);
    console.log('Decoded JWT token:', decoded);

    // Update the destination details
    if (destination_name && source_name) {
      const updateDestinationQuery = `
        UPDATE destination SET d_name = $1, source_name = $2
        WHERE destination_id = (
          SELECT destination_id FROM request WHERE request_id = $3
        )`;
      await pool.query(updateDestinationQuery, [destination_name, source_name, request_id]);
    }

    // Update the preference details
    if (is_smoking_allowed !== undefined || is_all_female !== undefined || notes) {
      const updatePreferenceQuery = `
        UPDATE preference SET is_smoking_allowed = COALESCE($1, is_smoking_allowed),
        is_all_female = COALESCE($2, is_all_female), notes = COALESCE($3, notes)
        WHERE preference_id = (
          SELECT preference_id FROM request WHERE request_id = $4
        )`;
      await pool.query(updatePreferenceQuery, [is_smoking_allowed, is_all_female, notes, request_id]);
    }

    res.status(200).json({
      message: 'Request updated successfully',
      request_id: request_id
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating request');
  }
},

 //all except the users own
 GetAllRequests: async (req, res) => {
  try {
    // Retrieve the token from the request header
    const token = req.headers.authorization;

    // Verify the JWT token and extract any necessary information
    const decoded = jwt.verify(token, jwtSecret);
    const member_id = decoded.userId;
    console.log(`The extracted user_id from the JWT token is: ${member_id}`);
    console.log('Decoded JWT token:', decoded);

    // Get all requests from the database
    const requestData = await pool.query(
      `SELECT * FROM request WHERE member_id != $1`,
      [member_id]
    );
    const requests = requestData.rows;

    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving requests');
  }
},

//gets all requests of the user only (works like history)
GetUserRequests: async (req, res) => {
  try {
    // Retrieve the token from the request header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token and extract any necessary information
    const decoded = jwt.verify(token, jwtSecret);
    const member_id = decoded.userId;
    console.log(`The extracted user_id from the JWT token is: ${member_id}`);
    console.log('Decoded JWT token:', decoded);

    // Get all requests from the database
    const requestData = await pool.query(
      `SELECT * FROM request WHERE member_id = $1`,
      [member_id]
    );
    const requests = requestData.rows;

    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving requests');
  }
},

// Delete a request
DeleteRequest: async (req, res) => {
  try {
    // Retrieve the token from the request header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token and extract the request_id
    const decoded = jwt.verify(token, jwtSecret);
    const request_id = decoded.requestId;
    console.log(`The extracted request_id from the JWT token is: ${request_id}`);
    console.log('Decoded JWT token:', decoded);

    // Delete the request from the database
    const deleteRequestQuery = `
      DELETE FROM request WHERE request_id = $1
    `;
    await pool.query(deleteRequestQuery, [request_id]);

    res.status(200).json({
      message: 'Request deleted successfully',
      request_id: request_id
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting request');
  }
}

 
  
}