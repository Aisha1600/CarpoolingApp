const pool = require("../db");

//checks if there is any car details for the given member_id api 


module.exports={
  //working
  addCar: async (req, res) => {
    try {
      const { name, model, make_year, license_no, license_valid_from } = req.body;
  
      // Input validation
      if (!name || !model || !make_year || !license_no || !license_valid_from) {
        return res.status(400).json({ error: 'Invalid input' });
      }
  
      console.log('Adding car');
      const result = await pool.query(
        'INSERT INTO car(name, model, make_year, license_no, license_valid_from) VALUES($1, $2, $3, $4, $5) RETURNING *',
        [name, model, make_year, license_no, license_valid_from]
      );
      const newCar = result.rows[0];
  
      // Response format
      res.status(201).json({
        message: 'Car added successfully',
        car: newCar,
      });
    } catch (error) {
      // Error handling
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  },

  //working 
  DisplayAllCars: async(req,res)=>{
    try {
      const allCars = await pool.query('SELECT * FROM car');
      res.status(200).send(allCars.rows);
  } catch (err) {
      console.error(err.message);
  }  
  },
  //use this to delete car details
  DeleteCar: async (req, res) => {
    try {
      const { car_id } = req.params;
      const deleteCar = await pool.query(
        "DELETE FROM car WHERE car_id = $1",
        [car_id]
      );
  
      if (deleteCar.rowCount === 0) {
        return res.status(404).send({ error: `Car with id ${car_id} not found` });
      }
  
      res.status(200).send("Car was deleted!");
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
    }
  },
UpdateCar: async(req,res)=>{
  try {
    const { car_id } = req.params;
    const { name, model, make_year, license_no, license_valid_from } = req.body;
    const updateCar = await pool.query(
        "UPDATE car SET name = $1, model=$2, make_year=$3, license_no=$4, license_valid_from=$5 WHERE car_id =$6",
        [name, model, make_year, license_no, license_valid_from, car_id]
    );

    res.json("Car is updated!");
} catch (err) {
    console.error(err.message);
  }
}
,
GetaCar: async (req, res) => {
  try {
    const { car_id } = req.params;

    const carname = await pool.query(
      `SELECT * FROM "car" 
      WHERE car_id = $1;`,
      [car_id]
    );
    res.json(carname.rows);
  } catch {
    res.sendStatus(400);
  }
},


}
