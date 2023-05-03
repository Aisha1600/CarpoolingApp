const pool = require("../db");
const jwt = require('jsonwebtoken');
const jwtSecret = 'itsworking';

//send a request (create a request and send it) -done
//unsend a request (delete the request)
//decline request (driver rejects the request status is updated)

module.exports={
    
     SendRequest: async (req, res) => {
      try {
        const { ride_id } = req.body;
    
        // Retrieve the token from the request header
        const token = req.headers.authorization.split(' ')[1];
    
        // Verify the JWT token and extract the member_id
        const decoded = jwt.verify(token, jwtSecret);
        const member_id = decoded.userId;
    
        // Insert a new request into the REQUEST_SENT table
        const insertRequestQuery = `
          INSERT INTO request_sent (member_id, ride_id, created_on)
          VALUES ($1, $2, NOW())
          RETURNING requestSent_id`;
        const { rows } = await pool.query(insertRequestQuery, [member_id, ride_id]);
    
        // Create a JWT token for the new request
        const requestSent_id = rows[0].requestSent_id;
        const requestSent_token = jwt.sign({ requestSent_id }, jwtSecret);
    
        // Update the request with the JWT token
        const updateTokenQuery = `
          UPDATE request_sent
          SET requestSent_token = $1
          WHERE requestSent_id = $2`;
        await pool.query(updateTokenQuery, [requestSent_token, requestSent_id]);
    
        res.status(201).json({
          message: 'Request created successfully',
          requestSent_id,
          requestSent_token
        });
      } catch (err) {
        console.error(err);
        res.status(500).send('Error creating request');
      }
    },
    
      

}