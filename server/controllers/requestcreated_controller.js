const pool = require("../db");

module.exports={
    // create a new request
   NewRequest:  async (req, res) => {
        
        try {
           const {destinationId,memberPreferenceId} = req.body;
          await pool.query('INSERT INTO request_created (destination_id, memberperference_id, reqcreated_on, reqcreated_status, reqscreated_on) VALUES ($1, $2, now(), $3, now())', [destinationId, memberPreferenceId, 'active']);
          res.status(200).send('Request created');
        } catch (err) {
          console.error(err);
          res.status(500).send('Error creating request');
        }
      },
      getAllRequests: async (req, res) => {
        
        try {
            const allRequests= await pool.query("Select * from request_created ");
          res.status(200).send(allRequests.rows);
        } catch (err) {
          console.error(err);
          res.status(500).send('Error creating request');
        }
      },
      
}