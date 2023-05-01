const pool = require("../db");
const jwt = require('jsonwebtoken');
const jwtSecret = 'itsworking';

//THIS IS FOR CREATED RIDES
//accept the driver that on the request you created (done)
//decline the driver on the request you created (done)
//im avaliable for the ride api (done)
//remove the im avaiable for ride 
module.exports={

    AVAILABLETORIDE: async (req, res) => {
    try {  
      // Retrieve the token from the request header
      const token = req.headers.authorization.split(' ')[1];
  
      // Verify the JWT token and extract the request_id
      const decoded = jwt.verify(token, jwtSecret);
      const request_id = decoded.requestId;
      console.log(`The extracted request_id from the JWT token is: ${request_id}`);
      console.log('Decoded JWT token:', decoded);

      const Astatus_id = 5;
  
      // Update the status of the request
      const updateStatusQuery = `
        UPDATE request SET status_id = $1
        WHERE request_id = $2`;
      await pool.query(updateStatusQuery, [Astatus_id, request_id]);
  
      res.status(200).json({
        message: 'Rider is available for this request',
        request_id: request_id
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating request status');
    }
  },

  ACCEPTDRIVER: async (req, res) => {
    try {  
      // Retrieve the token from the request header
      const token = req.headers.authorization.split(' ')[1];
  
      // Verify the JWT token and extract the request_id
      const decoded = jwt.verify(token, jwtSecret);
      const request_id = decoded.requestId;
      console.log(`The extracted request_id from the JWT token is: ${request_id}`);
      console.log('Decoded JWT token:', decoded);

      const Astatus_id = 6;
  
      // Update the status of the request
      const updateStatusQuery = `
        UPDATE request SET status_id = $1
        WHERE request_id = $2`;
      await pool.query(updateStatusQuery, [Astatus_id, request_id]);
  
      res.status(200).json({
        message: 'you accepted the driver',
        request_id: request_id
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating request status');
    }
  }, 

  REJECTDRIVER: async (req, res) => {
    try {  
      // Retrieve the token from the request header
      const token = req.headers.authorization.split(' ')[1];
  
      // Verify the JWT token and extract the request_id
      const decoded = jwt.verify(token, jwtSecret);
      const request_id = decoded.requestId;
      console.log(`The extracted request_id from the JWT token is: ${request_id}`);
      console.log('Decoded JWT token:', decoded);

      const Astatus_id = 7;
  
      // Update the status of the request
      const updateStatusQuery = `
        UPDATE request SET status_id = $1
        WHERE request_id = $2`;
      await pool.query(updateStatusQuery, [Astatus_id, request_id]);
  
      res.status(200).json({
        message: 'You rejected the driver',
        request_id: request_id
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating request status');
    }
  }, 

   NODRIVER: async (req, res) => {
    try {  
      // Retrieve the token from the request header
      const token = req.headers.authorization.split(' ')[1];
  
      // Verify the JWT token and extract the request_id
      const decoded = jwt.verify(token, jwtSecret);
      const request_id = decoded.requestId;
      console.log(`The extracted request_id from the JWT token is: ${request_id}`);
      console.log('Decoded JWT token:', decoded);

      const Astatus_id = 1;
  
      // Update the status of the request
      const updateStatusQuery = `
        UPDATE request SET status_id = $1
        WHERE request_id = $2`;
      await pool.query(updateStatusQuery, [Astatus_id, request_id]);
  
      res.status(200).json({
        message: 'driver changed their mind',
        request_id: request_id
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating request status');
    }
  }
  
    
      

}