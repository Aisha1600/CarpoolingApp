const pool = require("../db");

module.exports={

  //takes destination and ride details at once
  CreateARidee:  async (req, res) => {
    try {
      const { mcar_id } = req.params;
      const {destination_name, source_name, created_on, travel_start_time, seats_offered, contribution_per_head} = req.body;
  
      // Insert the destination details into the destination table
      const destinationData = await pool.query(
        `INSERT INTO destination (d_name, source_name)
         VALUES ($1, $2)
         RETURNING destination_id`,
        [destination_name, source_name]
      );
      const destination_id = destinationData.rows[0].destination_id;
  
      // Insert the ride details into the ride table
      await pool.query(
        `INSERT INTO ride (destination_id, mcar_id, created_on, travel_start_time, seats_offered, contribution_per_head)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [destination_id, mcar_id, created_on, travel_start_time, seats_offered, contribution_per_head]
      );
  
      res.status(200).send('Ride created');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating ride');
    }
  },

  EditARide: async (req, res) => {
    try {
      const { ride_id } = req.params;
      const {destination_name, source_name, created_on, travel_start_time, seats_offered, contribution_per_head} = req.body;
  
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

// Delete a ride
DeleteARide:  async (req, res) => {
  try {
    const { ride_id } = req.params;
    
    // Check if ride_id is valid
    // if (!uuidValidate(ride_id)) {
    //   return res.status(400).send('Invalid ride ID');
    // }

    // Check if ride exists in the database
    const ride = await pool.query(
      `SELECT *
       FROM ride
       WHERE ride_id = $1`,
      [ride_id]
    );
    if (ride.rows.length === 0) {
      return res.status(404).send('Ride not found');
    }

    // Delete the ride
    await pool.query(
      `DELETE FROM ride
       WHERE ride_id = $1`,
      [ride_id]
    );

    res.status(200).send('Ride deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting ride');
  }
},

RideRating: async (req, res) => {
  try {
    const { rideId } = req.params;
    const { rating } = req.body;

    const data = await pool.query(`
      UPDATE RIDE
      SET RIDE_RATING = $1
      WHERE RIDE_ID = $2
      RETURNING *
    `, [rating, rideId]);

    if (data.rows.length === 0) {
      return res.sendStatus(404);
    }

    res.status(201).json(data.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
},

  
   CreateARide:  async (req, res) => {
        
        try {
            const {destinationId,mcarId,createdOn,travelStartTime,seatsOffered,contributionPerHead,rideRating} = req.body;
          await pool.query(
            `INSERT INTO ride (destination_id, mcar_id, created_on, travel_start_time, seats_offered, contribution_per_head, ride_rating)
            VALUES ($1, $2, $3, $4, $5, $6, $7);`,
           [destinationId, mcarId, createdOn, travelStartTime, seatsOffered, contributionPerHead, rideRating]);
          res.status(200).send('Ride created');
        } catch (err) {
          console.error(err);
          res.status(500).send('Error creating ride');
        }
      },
  
     DeleteRide: async (req, res) => {
        const {rideId} = req.params.id;
        try {
          await pool.query('DELETE FROM ride WHERE ride_id = $1', 
          [rideId]
          );
          res.status(200).send('Ride deleted');
        } catch (err) {
          console.error(err);
          res.status(500).send('Error deleting ride');
        }
      },
      //Get a ride by id
    GetARide :async (req, res) => {
        const rideId = req.params.id;
        try {
          const result = await pool.query('SELECT * FROM ride WHERE ride_id = $1', [rideId]);
          res.status(200).json(result.rows[0]);
        } catch (err) {
          console.error(err);
          res.status(500).send('Error retrieving ride');
        }
      },

      getAllRides: async (req, res) => {
        try {
          const result = await pool.query('SELECT * FROM ride');
          res.status(200).json(result.rows);
        } catch (err) {
          console.error(err);
          res.status(500).send('Error retrieving rides');
        }
      },
      updateRideRating: async (req, res) => {
        
        try {;
            const {rideId}=req.params
            const {rideRating} = req.body;
          await pool.query('UPDATE ride SET ride_rating = $1 WHERE ride_id = $2', [rideRating, rideId]);
          res.status(200).send('Ride rating updated');
        } catch (err) {
          console.error(err);
          res.status(500).send('Error updating ride rating');
        }
      }
      
      
}
