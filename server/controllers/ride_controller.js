const pool = require("../db");

module.exports={
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
