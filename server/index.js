const express = require("express");
const app = express();
const cors = require("cors"); 
const pool = require("./db.js");
const car_route= require('./routers/car_route')
const member_route= require('./routers/member_router')
const destination_route= require('./routers/destination_route')
const membercar_route= require('./routers/membercar_router')
const ride_route= require('./routers/ride_route.js')
const requestcreated_route= require('./routers/requestcreated_route.js')
const preference_route = require('./routers/perf_route.js')
const pythonAPI_route = require('./routers/pythonAPI_route.js')
const requeststatus_route = require('./routers/requeststatus_route.js')
const requestsent_route = require('./routers/requestsent_route.js')


app.use(cors());
app.use(express.json())
app.use('/car',car_route)
app.use('/member',member_route)
app.use('/',membercar_route)
app.use('/destination',destination_route)
app.use('/', preference_route)
app.use('/', requestcreated_route)
app.use('/', ride_route)
app.use('/', requeststatus_route)
app.use('/', requestsent_route)
app.use('/', pythonAPI_route)





  
app.listen(5000, () =>{
    console.log("Server has started on port 5000")
})