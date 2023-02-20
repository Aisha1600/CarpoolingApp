const pool = require("../db");

module.exports={
    //updaterequest status
    UpdateStatus: async (req, res) => {
        const requestId = req.params.id;
        const requestStatus = req.body.requestStatus;
        try {
          await pool.query('UPDATE request_sent SET req_status = $1 WHERE requestsent_id = $2', [requestStatus, requestId]);
          res.status(200).send('Request status updated');
        } catch (err) {
          console.error(err);
          res.status(500).send('Error updating request status');
        }
      },
      getAllRequests: async (req, res) => {
        
        try {
         const allRequests= await pool.query("Select * from request_sent");
          res.status(200).send(allRequests.rows);
        } catch (err) {
          console.error(err);
          res.status(500).send('Error creating request');
        }
      },
      //get all requests sent for specific ride
      
}