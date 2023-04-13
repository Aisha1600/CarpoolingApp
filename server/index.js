const express = require("express");
const app = express();
const cors = require("cors"); 
const pool = require("./db.js");
const car_route= require('./routers/car_route')
const member_route= require('./routers/member_router')
const destination_route= require('./routers/destination_route')
const membercar_route= require('./routers/membercar_router')
const ride_route= require('./routers/ride_route')
const request_route= require('./routers/request_route.js')
const preference_route = require('./routers/perf_route.js')




app.use(cors());
app.use(express.json())
app.use('/car',car_route)
app.use('/member',member_route)
app.use('/',membercar_route)
app.use('/destination',destination_route)
app.use('/', preference_route)
app.use('/request', request_route)
//app.use('/ride',ride_route)
//app.use('/',request_route)
// app.use('/requestsent',requestsent_route)





  
app.listen(5000, () =>{
    console.log("Server has started on port 5000")
})