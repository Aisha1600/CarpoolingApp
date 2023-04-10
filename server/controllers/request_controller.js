const pool = require("../db");

module.exports={
  //create a new request
  CreateRequest:  async (req, res) => {
        
    try {
       const {destinationId,memberPreferenceId} = req.body;
      await pool.query('INSERT INTO request_created (destination_id, memberperference_id, reqcreated_on, reqcreated_status, reqscreated_on) VALUES ($1, $2, now(), $3, now())', [destinationId, memberPreferenceId, 'active']);
      res.status(200).send('Request created');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating request');
    }
  },
    //updaterequest status
    UpdateStatus: async (req, res) => {
        const requestId = req.params.id;
        const requestStatus = req.body.requestStatus;
        try {
          await pool.query('UPDATE request_sent SET req_status = $1 WHERE requestsent_id = $2', [requestStatus, requestId]);
          res.status(200).send('Request status updated');
        } catch (err) {
          console.error(err);
          res.status(500).send('Error updating request status.');
        }
      },
      getAllRequests: async (req, res) => {
        
        try {
         const allRequests= await pool.query("Select * from request");
          res.status(200).send(allRequests.rows);
        } catch (err) {
          console.error(err);
          res.status(500).send('Something went wrong.');
        }
      },
      //get all requests sent for specific ride
      
}