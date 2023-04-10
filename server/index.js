const express = require("express");
const app = express();
const cors = require("cors"); 
const pool = require("./db.js");
const car_route= require('./routers/car_route')
const member_route= require('./routers/member_router')
const destination_route= require('./routers/destination_route')
const membercar_route= require('./routers/membercar_router')
const ride_route= require('./routers/ride_route')
const requestcreated_route= require('./routers/requestcreated_route')
const requestsent_route= require('./routers/requestsent_route')




app.use(cors());
app.use(express.json())
app.use('/car',car_route)
app.use('/member',member_route)
app.use('/',membercar_route)
app.use('/destination',destination_route)
// app.use('/rides',ride_route)
// // app.use('/requestcreated',requestcreated_route)
// app.use('/requestsent',requestsent_route)





  
app.listen(5000, () =>{
    console.log("Server has started on port 5000")
})