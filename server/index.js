const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const car_route= require('./routers/car_route')
const member_route= require('./routers/member_router')
const destination_route= require('./routers/destination_route')
const membercar_route= require('./routers/membercar_router')



app.use(cors());
app.use(express.json())
app.use('/car',car_route)
app.use('/member',member_route)
app.use('/membercar',membercar_route)
app.use('/destination',destination_route)




  
app.listen(5432, () =>{
    console.log("Server has started on port 5000")
})