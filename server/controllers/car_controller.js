const pool = require("../db");

module.exports={
  addCar:  async (req, res) => {
    try {
      const { name,model,make_year, rating } = req.body;
      console.log("Adding car");
      await pool.query(
        `INSERT INTO "car" (name,model,make_year, rating) 
        VALUES ($1, $2,$3,$4);`,
        [name,model,make_year, rating]
      );
  
      res.sendStatus(200);
    } catch (e) {
      return res.status(401).send({
        error: 'Something went wrong',
      });
    }
  },
  DisplayAllCars: async(req,res)=>{
    try {
      const allCars = await pool.query("SELECT * FROM car");
      res.status(200).send(allCars.rows);
    } catch (err) {
      console.error(err.message);
    }
  },
  DeleteCar: async(req,res)=>{
    try {
      const { car_id } = req.params;
      const deleteCar = await pool.query(
          "DELETE FROM car WHERE car_id = $1",
          [car_id]
      );
      res.status(200).send("Car  was deleted!");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
},
UpdateCar: async(req,res)=>{
  try {
    const { car_id } = req.params;
    const {name, model,make_year,rating } = req.body;
    const updateCar = await pool.query(
        "UPDATE car SET name = $1, model=$2, make_year=$3, rating=$4 WHERE car_id =$5",
        [name, model,make_year,rating, car_id]
    );

    res.json("Car is updated!");
} catch (err) {
    console.error(err.message);
}
},
GetaCar: async(req,res)=>{
  try {
    const { car_id } = req;

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
