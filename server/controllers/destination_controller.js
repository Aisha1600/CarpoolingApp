const pool = require("./db");

//update source 

const UpdateSource = async (req, res) => {
    try {
        const { destination_id } = req.params;
        const {source_name, s_address} = req.body;
        const updateSource = await pool.query(
            "UPDATE destination SET source_name = $1, s_address=$2 WHERE destination_id =$3",
            [source_name, s_address,destination_id]
        );
    
        res.json("Source is updated!");
    } catch {
      res.sendStatus(400);
    }
  };

//insert source 
const InsertSource = async(req,res) => {
    //async provides wait
    try {
        const{source_name, s_address} = req.body;
      console.log("Adding source");
      await pool.query("INSERT INTO destination(source_name, s_address) VALUES($1, $2)", [source_name, s_address]);
        res.sendStatus(200);
    } catch (err) {

        return res.status(401).send({
            error: 'Something went wrong'

        });   
    
    }
};
//get source 
const GetSource = async(req, res) => {
    try {
        const { destination_id } = req;

const sourcename = await pool.query(
  `SELECT source_name, s_address FROM "destination" 
  WHERE destination_id = $1;`,
  [destination_id]
);
res.json(sourcename.rows); 
    } catch (err) {
        console.error(err.message);
    }
}
//delete source 
const DeleteSource = async(req, res) => {
    try {
        const { destination_id } = req.params;
        const deletesource = await pool.query(
            "DELETE source_name, s_address FROM destination WHERE destination_id = $1",
            [destination_id]
        );
        res.json("source was deleted!");
    } catch (err) {
        console.error(err.message);
    }
} 
//update destination
const UpdateDest = async (req, res) => {
    try {
        const { destination_id } = req.params;
        const {source_name, s_address} = req.body;
        const updateDest = await pool.query(
            "UPDATE destination SET destination_name = $1, d_address=$2 WHERE destination_id =$3",
            [destination_name, d_address,destination_id]
        );
    
        res.json("destination is updated!");
    } catch {
      res.sendStatus(400);
    }
  };
//insert source 
const InsertDestination = async(req,res) => {
    //async provides wait
    try {
        const{source_name, s_address} = req.body;
      console.log("Adding source");
      await pool.query("INSERT INTO destination(destination_name, d_address) VALUES($1, $2)", [destination_name, d_address]);
        res.sendStatus(200);
    } catch (err) {

        return res.status(401).send({
            error: 'Something went wrong'

        });   
    
    }
};
//get destination
const GetDest = async(req, res) => {
    try {
        const { destination_id } = req;

const dname = await pool.query(
  `SELECT destination_name, d_address FROM "destination" 
  WHERE destination_id = $1;`,
  [destination_id]
);
res.json(dname.rows); 
    } catch (err) {
        console.error(err.message);
    }
}
//delete des 
const DeleteDest = async(req, res) => {
    try {
        const { destination_id } = req.params;
        const deletesource = await pool.query(
            "DELETE destination_name, d_address FROM destination WHERE destination_id = $1",
            [destination_id]
        );
        res.json("destination was deleted!");
    } catch (err) {
        console.error(err.message);
    }
} 