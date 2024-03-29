const pool = require("../db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const token = "carpool";
const jwtSecret = 'itsworking';

module.exports={


  //jwt auth + ride_id 
  CreateRideJ: async (req, res) => {
    try {
      const { destination_name, source_name, created_on, travel_start_time, seats_offered, contribution_per_head } = req.body;
  
      // Retrieve the token from the request header
      const token = req.headers.authorization;
  
      // Verify the JWT token and extract the member_id
      const decoded = jwt.verify(token, jwtSecret);
      const member_id = decoded.userId;
      console.log(`The extracted member_id from the JWT token is: ${member_id}`);
      console.log('Decoded JWT token:', decoded);
  
      // get the mcar_id from the member_car table using the member_id
      const mcarData = await pool.query(
        `SELECT mcar_id FROM member_car WHERE member_id = $1`,
        [member_id]
      );
      
      if (!mcarData.rows[0]) {
        return res.status(404).json({ error: 'Member car not found' });
        console.log('Member car not found');
      }
      
      const mcar_id = mcarData.rows[0].mcar_id;

      // Insert the destination details into the destination table
      const destinationData = await pool.query(
        `INSERT INTO destination (d_name, source_name)
         VALUES ($1, $2)
         RETURNING destination_id`,
        [destination_name, source_name]
      );
      const destination_id = destinationData.rows[0].destination_id;
  
      // Insert the ride details into the ride table
      const rideData = await pool.query(
        `INSERT INTO ride (destination_id, mcar_id, member_id, created_on, travel_start_time, seats_offered, contribution_per_head)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING ride_id`,
        [destination_id, mcar_id, member_id, created_on, travel_start_time, seats_offered, contribution_per_head]
      );
      const ride_id = rideData.rows[0].ride_id;
  
      // Create a JWT token containing the ride_id
      const rideToken = jwt.sign({ ride_id }, jwtSecret);

  
      // Add the rideToken to the ride table
      await pool.query(
        `UPDATE ride SET ride_token = $1 WHERE ride_id = $2`,
        [rideToken, ride_id]
      );
  
      res.status(201).json({
        message: 'Ride created successfully',
        ride: rideData.rows[0],
        token: token
      });

    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating ride');
    }
  },

EditARidee: async (req, res) => {
  try {
    const { destination_name, source_name, created_on, travel_start_time, seats_offered, contribution_per_head } = req.body;

    // Retrieve the token from the request header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token and extract the ride_id
    const decoded = jwt.verify(token, jwtSecret);
    const ride_id = decoded.ride_id;
    console.log(`The extracted ride_id from the JWT token is: ${ride_id}`);
    console.log('Decoded JWT token:', decoded);

    // Update the destination details of the ride in the destination table
    await pool.query(
      `UPDATE destination SET d_name = $1, source_name = $2 WHERE destination_id IN 
       (SELECT destination_id FROM ride WHERE ride_id = $3)`,
      [destination_name, source_name, ride_id]
    );

    // Update the ride details in the ride table
    await pool.query(
      `UPDATE ride SET created_on = $1, travel_start_time = $2, seats_offered = $3, contribution_per_head = $4 WHERE ride_id = $5`,
      [created_on, travel_start_time, seats_offered, contribution_per_head, ride_id]
    );

    res.status(200).send('Ride updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating ride');
  }
},

//jwt auth delete
DeleteARidee: async (req, res) => {
  try {
    // Retrieve the token from the request header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token and extract the ride_id
    const decoded = jwt.verify(token, jwtSecret);
    const ride_id = decoded.ride_id;
    console.log(`The extracted ride_id from the JWT token is: ${ride_id}`);
    console.log('Decoded JWT token:', decoded);

    // Delete the ride from the ride table
    await pool.query(
      `DELETE FROM ride WHERE ride_id = $1`,
      [ride_id]
    );

    res.status(200).send('Ride deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting ride');
  }
},

GetAllUserRides: async (req, res) => {
  try {
    // Retrieve the token from the request header
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).send('Missing Authorization Header');
    }
    const token = authorizationHeader.split(' ')[1];

    // Verify the JWT token and extract the user_id
    const decoded = jwt.verify(token, jwtSecret);
    const member_id = decoded.userId;
    console.log(`The extracted user_id from the JWT token is: ${member_id}`);
    console.log('Decoded JWT token:', decoded);

    // Retrieve all the rides for the user
    const result = await pool.query(
      `SELECT * FROM ride WHERE member_id = $1`,
      [member_id]
    );
    console.log('All rides for user:', result.rows);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving rides');
  }
},

GetAllRides: async (req, res) => {
  try {
    // Retrieve the token from the request header
    const token = req.headers.authorization;

    // Verify the JWT token and extract the user_id
    const decoded = jwt.verify(token, jwtSecret);
    const user_id = decoded.userId;
    console.log(`The extracted user_id from the JWT token is: ${user_id}`);
    console.log('Decoded JWT token:', decoded);

    // Retrieve all rides from the database
    const rides = await pool.query(
      `SELECT * FROM ride WHERE member_id != $1`,
      [user_id]
    );
    console.log('All rides for user:', rides.rows);
    res.status(200).send(rides.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving rides');
  }
},

GetAllCurrentRides: async (req, res) =>  {
  try {
    const currentDate = new Date(); // get current date and time
    const ridesData = await pool.query(
      `SELECT r.ride_id, r.member_id, d.d_name, r.travel_start_time, r.seats_offered, r.contribution_per_head
       FROM ride r
       JOIN member_car mc ON r.mcar_id = mc.mcar_id
       JOIN car c ON mc.car_id = c.car_id
       JOIN destination d ON r.destination_id = d.destination_id
       WHERE r.travel_start_time > $1
       ORDER BY r.travel_start_time ASC`,
      [currentDate]
    );
    const rides = ridesData.rows;
    res.status(200).json({
      message: 'Rides retrieved successfully',
      rides: rides
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving rides');
  }
}


      
}
