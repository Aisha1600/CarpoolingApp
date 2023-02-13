
const pool = require("./db");


const SignUp = async(req,res) => {
    //async provides wait
    try {
        const{f_name, l_name, contact_no, gender, password, cnic} = req.body;
      console.log("Adding member");
      await pool.query("INSERT INTO member(f_name,  l_name, contact_no, gender, password, cnic) VALUES($1, $2, $3, $4, $5,$6)", [f_name, l_name, contact_no, gender, password, cnic]);
        res.sendStatus(200);
    } catch (err) {

        return res.status(401).send({
            error: 'Something went wrong'

        });   
    
    }
};
    //get all users

    const GetAllMembers = async(req, res) => {
        try {
            const allmembers = await pool.query("SELECT * FROM member");
            res.json(allTodos.members);
        } catch (err) {
            console.error(err.message);
        }
    }


//update a user

app.put("/todos/:id", async(req, res) => {
    try {
        const { member_id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE member_id = 2",
            [description, id]
        );

        res.json("Todo was updated!");
    } catch (err) {
        console.error(err.message);
    }
})

//delete a user

const DeleteMember = async(req, res) => {
    try {
        const { member_id } = req.params;
        const deleteMember = await pool.query(
            "DELETE FROM member WHERE member_id = $1",
            [member_id]
        );
        res.json("member was deleted!");
    } catch (err) {
        console.error(err.message);
    }
}

const getMember = async (req, res) => {
    try {
      const { member_id } = req;
  
      const username = await pool.query(
        `SELECT * FROM "member" 
        WHERE member_id = $1;`,
        [member_id]
      );
      res.json(username.rows);
    } catch {
      res.sendStatus(400);
    }
  };

    