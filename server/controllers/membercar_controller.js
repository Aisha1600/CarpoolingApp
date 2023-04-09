
const pool = require("../db");

module.exports={
    UpdateCarM: async (req, res) => {
        try {
            const { member_id } = req.params; 
            const {car_regno, car_color} = req.body;
            const updateCarM = await pool.query(
                "UPDATE member_car JOIN member  ON member.member_id = member_car.member_id SET member_car.car_regno = $1,member_car.car_color = $2 WHERE member.member_id = $3",
                [car_regno, car_color,member_id]
            );
        
            res.json("reg and color is updated accroding to member id!");
        } catch {
          res.sendStatus(400);
        }
  },
  DeleteCarReg: async(req, res) => {
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
  },
  DeleteCarColor: async(req, res) => {
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
},
DeleteCarDetails: async(req, res) => {
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
},
InsertCarDetails: async (req, res) => {
    try {
        const { car_id, member_id, car_regno, car_color } = req.body;
        console.log("Adding car details");
        await pool.query("INSERT INTO MEMBER_CAR (CAR_ID, MEMBER_ID, CAR_REGNO, CAR_COLOR) VALUES ($1, $2, $3, $4);", [car_id, member_id, car_regno, car_color]);
        res.sendStatus(200);
    } catch (err) {
        return res.status(401).send({
            error: 'Something went wrong'
        });   
    }
},
GetCarMember: async(req, res) => {
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

},

GetAllDetails: async(req, res) => {
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
},
GetCarDetails: async(req, res) => {
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
},
//new stuff
MemberCar: async(req, res) => {
    try {
      const { member_id } = req.params;
      const { name, model, make_year, license_no, license_valid_from, car_regno, car_color } = req.body;
  
      // Insert new car details into the car table
      const newCar = await pool.query(
        "INSERT INTO car (name, model, make_year, license_no, license_valid_from) VALUES ($1, $2, $3, $4, $5) RETURNING car_id",
        [name, model, make_year, license_no, license_valid_from]
      );
  
      // Get the car ID of the newly inserted car
      const car_id = newCar.rows[0].car_id;
  
      // Insert the new car details into the member_car table
      const newMemberCar = await pool.query(
        "INSERT INTO member_car (member_id, car_id, car_regno, car_color) VALUES ($1, $2, $3, $4) RETURNING mcar_id",
        [member_id, car_id, car_regno, car_color]
      );
  
      res.status(200).send("Car was added to member!");
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

//check check check check
NewMemberCar: async(req, res) => {
    try {
      const { member_id } = req.params;
      const { name, model, make_year, license_no, license_valid_from, car_regno, car_color } = req.body;
  
      // Input validation
      if (!name || !model || !make_year || !license_no || !license_valid_from || !car_regno || !car_color) {
        return res.status(400).json({ error: 'Invalid input' });
      }

      // Insert new car details into the car table
      const newCar = await pool.query(
        "INSERT INTO car (name, model, make_year, license_no, license_valid_from) VALUES ($1, $2, $3, $4, $5) RETURNING car_id",
        [name, model, make_year, license_no, license_valid_from]
      );
  
      // Get the car ID of the newly inserted car
      const car_id = newCar.rows[0].car_id;
  
      // Insert the new car details into the member_car table
      const newMemberCar = await pool.query(
        "INSERT INTO member_car (member_id, car_id, car_regno, car_color) VALUES ($1, $2, $3, $4) RETURNING mcar_id",
        [member_id, car_id, car_regno, car_color]
      );
  
      res.status(200).send("Car was added to member!");
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }

  
  
};

//update car regno and car color according to member id


/*const UpdateCarM = async (req, res) => {
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
};*/