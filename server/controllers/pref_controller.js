const pool = require("../db");

module.exports={

    //changes made
    //working!
  AddPrefer: async (req, res) => {
    try {
        const { member_id } = req.params;
        const { is_smoking_allowed, is_all_female, notes } = req.body;
        await pool.query('INSERT INTO preference (member_id, is_smoking_allowed, is_all_female, notes) VALUES ($1, $2, $3, $4) RETURNING *',
            [member_id, is_smoking_allowed, is_all_female, notes]);
        res.status(201).send('Preference added successfully!');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
},

    
    //user adds a preference (Aamna)
    //not working properly
    AddPref:  async (req, res) => {
        
        try {
        //  const { member_id } = req.params;

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
      //working!!
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
      //needed this for update/edit
      //working
      UpdatePrefForMember: async (req, res) => {
        try {
          const { member_id, is_smoking_allowed, is_all_female, notes } = req.body;
          const updatePref = await pool.query(
            'UPDATE preference SET is_smoking_allowed = $1, is_all_female = $2, notes = $3 WHERE member_id = $4',
            [is_smoking_allowed, is_all_female, notes, member_id]
          );
          res.json(`Preferences updated for member with ID ${member_id}.`);
        } catch (err) {
          console.error(err);
          res.status(500).send('Error updating preferences.');
        }
      },
      // Get preferences for a member
GetPref: async (req, res) => {
  try {
    const member_id = req.params.member_id;
    const getpref = await pool.query(
      'SELECT * FROM preference WHERE member_id = $1', [member_id]
    );
    res.json(getpref.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving preferences.');
  }
}

      
}