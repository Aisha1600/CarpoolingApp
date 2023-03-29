const pool = require("./db");

//update car regno and car color according to member id


const UpdateCarM = async (req, res) => {
    try {
        const { member_id } = req.params; //check if the right id is put here
        const {car_regno, car_color} = req.body;
        const updateCarM = await pool.query(
            "UPDATE member_car JOIN member  ON member.member_id = member_car.member_id SET member_car.car_regno = $1,member_car.car_color = $2 WHERE member.member_id = $3",
            [car_regno, car_color,member_id]
        );
    
        res.json("reg and color is updated accroding to member id!");
    } catch {
      res.sendStatus(400);
    }
  };

  //delete car reg  according to member id

  const DeleteCarReg = async(req, res) => {
    try {
        const { member_id } = req.params;
        const deletecarM = await pool.query(
            "DELETE car_regno FROM member_car JOIN member ON member.member_id = member_car.member_id WHERE member.member_id = $1"
            [member_id]
        );
        res.json("reg was deleted according to member id!");
    } catch (err) {
        console.error(err.message);
    }
}; 

//delete car reg  according to member id

const DeleteCarColor = async(req, res) => {
    try {
        const { member_id } = req.params;
        const deletecarcolor = await pool.query(
            "DELETE car_color FROM member_car JOIN member ON member.member_id = member_car.member_id WHERE member.member_id = $1"
            [member_id]
        );
        res.json("color was deleted according to member id!");
    } catch (err) {
        console.error(err.message);
    }
}; 

//delete both 

const DeleteCarDetails = async(req, res) => {
    try {
        const { member_id } = req.params;
        const deletecardetails = await pool.query(
            "DELETE car_color,car_regno FROM member_car JOIN member ON member.member_id = member_car.member_id WHERE member.member_id = $1"
            [member_id]
        );
        res.json("color and reg was deleted according to member id!");
    } catch (err) {
        console.error(err.message);
    }
}; 



  const InsertCarDetails = async(req,res) => {
    //async provides wait
    try {
        const{car_id, member_id, car_regno,car} = req.body;
      console.log("Adding source");
      await pool.query("INSERT INTO member_car(car_id, member_id, car_regno,car) VALUES($1, $2,$3,$4)", [car_id, member_id, car_regno,car]);
        res.sendStatus(200);
    } catch (err) {

        return res.status(401).send({
            error: 'Something went wrong'

        });   
    
    }
};

  //get car details according to member id 

  const GetCarMember = async(req, res) => {
    try {
        const { member_id } = req; //check syntax

const getcarm = await pool.query(
  `SELECT * FROM member JOIN member_car ON member.member_id = member_car.member_id;`,
  [member_id]
);
res.json(sourcename.rows); 
    } catch (err) {
        console.error(err.message);
    }
};

//get information of member and car and member car

const GetAllDetails = async(req, res) => {
    try {
        const { member_id } = req; //check syntax

const getall = await pool.query(
  `SELECT * FROM member
  JOIN member_car
  ON member.member_id = member_car.member_id;
  JOIN car
  ON car.car_id = member_car.car_id;
  `,
  [member_id]
);
res.json(sourcename.rows); 
    } catch (err) {
        console.error(err.message);
    }
};

//get complete car details

const GetCarDetails = async(req, res) => {
    try {
        const { car_id } = req; //check syntax

const getcardet = await pool.query(
  `SELECT * FROM car JOIN member_car ON car.car_id = member_car.car_id;`,
  [car_id]
);
res.json(sourcename.rows); 
    } catch (err) {
        console.error(err.message);
    }
};