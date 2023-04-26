const Pool = require("pg").Pool;
const pool = new Pool({
    user: "postgres",
    password: "crazylady",
    host: "localhost",
    port: 5432,
    database:  "carpoolingdatabase"
});
// const pool = new Pool({
//     user: "postgres",
//     password: "vortex",
//     host: "localhost",
//     port: 5432,
//     database:  "perncarpool"
// });




module.exports = pool;