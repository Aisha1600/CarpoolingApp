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
      res.json(allCars.rows);
    } catch (err) {
      console.error(err.message);
    }
  }
}
