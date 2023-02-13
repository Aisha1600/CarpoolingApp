const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const car_route= require('./routers/car_route')

app.use(cors());
app.use(express.json())
app.use('/car',car_route)


  
app.listen(5432, () =>{
    console.log("Server has started on port 5000")
})