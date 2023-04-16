const Pool = require("pg").Pool;
const pool = new Pool({
    // user: "postgres",
    // password: "vortex",
    //   host: "localhost",
    //   port: 5432,
    //  database:  "carpool"
    user: "postgres",
    password: "kashaf12",
    host: "localhost",
    port: 5432,
    database:  "Carpool"
});
// const pool = new Pool({
//     user: "postgres",
//     password: "vortex",
//     host: "localhost",
//     port: 5432,
//     database:  "perncarpool"
// });
// const pool = new Pool({
//     user: "postgres",
//     password: "postgres",
//     host: "localhost",
//     port: 5432,
//     database:  "carpooling"
// });




module.exports = pool;