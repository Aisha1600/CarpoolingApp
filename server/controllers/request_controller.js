const pool = require("../db");

module.exports={
  //create a new request
  CreateRequest:  async (req, res) => {     
    try {
       const {requestId,memberID} = req.body;
      await pool.query('INSERT INTO request (destination_id, memberperference_id, reqcreated_on, reqcreated_status, reqscreated_on) VALUES ($1, $2, now(), $3, now())', [requestId, memberID, 'active']);
      res.status(200).send('Request created');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating request');
    }
  },
  GetAvailableRides: async(req, res) => {
    try {
      // Query to get all available rides
      const ridesQuery = `
        SELECT ride_id, d_name, source_name, d_address, s_address, 
               seats_offered, contribution_per_head, ride_rating, 
               f_name || ' ' || l_name AS member_name, car_regno, car_color 
        FROM ride 
        INNER JOIN destination ON ride.destination_id = destination.destination_id 
        INNER JOIN member_car ON ride.mcar_id = member_car.mcar_id 
        INNER JOIN car ON member_car.car_id = car.car_id 
        INNER JOIN member ON member_car.member_id = member.member_id 
        WHERE travel_start_time > NOW() 
        ORDER BY travel_start_time ASC;
      `;
  
      // Get a database client from the pool
      const client = await pool.connect();
  
      // Execute the query
      const ridesResult = await client.query(ridesQuery);
  
      // Release the database client back to the pool
      client.release();
  
      // Send the response
      res.status(200).json({
        status: 'success',
        data: ridesResult.rows,
        message: 'All available rides fetched successfully',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  },
  EditRequest: async(req, res) => {
    try {
      const { destinationId, mcarId, travelStartTime, seatsOffered, contributionPerHead } = req.body;
      const requestId = req.params.requestId;
  
      const rideExists = await pool.query('SELECT * FROM request WHERE request_id = $1', [requestId]);
      if (rideExists.rows.length === 0) {
        return res.status(404).json({ message: 'Request not found' });
      }
      //if request found
      const updateRide = await pool.query(
        'UPDATE ride SET destination_id = $1, mcar_id = $2, travel_start_time = $3, seats_offered = $4, contribution_per_head = $5 WHERE ride_id = $6 RETURNING *',
        [destinationId, mcarId, travelStartTime, seatsOffered, contributionPerHead, rideId]
      );
  
      res.json(updateRide.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  },
  DeleteRequest: async(req, res) => {
    try {
      const requestId = req.params.requestId;
      const rideExists = await pool.query('SELECT * FROM request WHERE request_id = $1', [requestId]);

      if (rideExists.rows.length === 0) {
        return res.status(404).json({ message: 'Request not found' });
      }
      await pool.query('DELETE FROM request WHERE request_id = $1', [requestID]);
      res.json({ message: 'Request deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  },
  SendRequestToRider: async(req, res) => {

  },
  GetStatusRequest: async(req, res) => {
    try {
      const requestId = req.params.requestId;
      const request = await pool.query(
        'SELECT request_status FROM request WHERE request_id = $1',
        [requestId]
      );
      if (request.rows.length === 0) {
        return res.status(404).send('Ride request not found');
      }
      return res.status(200).json(request.rows[0].status);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
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
}