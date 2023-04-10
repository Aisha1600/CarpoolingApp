const pool = require("../db");

module.exports={
    //user adds a preference
    AddPref:  async (req, res) => {
        
        try {
           const {is_smoking_allowed, is_all_female, notes} = req.body;
          await pool.query('INSERT INTO preference (is_smoking_allowed, is_all_female, notes) VALUES ($1, $2, $3) RETURNING *',
          [is_smoking_allowed, is_all_female, notes]);
          res.status(200).send('Preference added!');
          res.json(result.rows[0]);
        } catch (err) {
          console.error(err);
          res.status(500).send('Error adding preference.');
        }
      },
      //user deletes a preference
      DeletePref: async (req, res) => {
        try {
            const { preference_id } = req.body;
            const deletepref = await pool.query(
                'DELETE FROM preference WHERE preference_id = $1', [preference_id]
            );
            res.json("Preference removed.");
        } catch (err) {
            console.error(err);
          res.status(500).send('Error deleting preference.');
        }
      },      
}