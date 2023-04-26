const pool = require("../db");
const { PythonShell } = require('python-shell');

module.exports = {
  recommendations: async (req, res) => {
    const memberId = req.params.memberId;

    const options = {
      mode: 'text',
      pythonPath: 'C:/Users/HP/AppData/Local/Programs/Python/Python311/python.exe',
      pythonOptions: ['-u'],
      scriptPath: 'C:/Users/HP/Documents/GitHub/CarpoolingApp/server',
      args: [memberId],
    };

    try {
      const results = await PythonShell.run('recommendation_system.py', options);
      const recommendations = JSON.parse(results[0]);
      res.json(recommendations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};




// const pool = require("../db");
// //const express = require('express');
// const { PythonShell } = require('python-shell');
    
// //const app = express();

// module.exports={

    
//    // Define endpoint for recommendations
//   //  app.get('/recommendations/:memberId', (req, res) => {
//     recommendations:  async (req, res) => {
//       // Get member ID from request parameters
//       const memberId = req.params.memberId;
    
//       // Configure Python shell options
//       const options = {
//         mode: 'text',
//         pythonPath: 'C:/Users/HP/AppData/Local/Programs/Python/Python311/python.exe', //python path
//         pythonOptions: ['-u'],
//         scriptPath: 'C:/Users/HP/Documents/GitHub/CarpoolingApp/server', // Replace with path to Python script
//         args: [memberId],
//       };
    
//       // Call Python script to get recommendations
//       PythonShell.run('recommendation_system.py', options, (err, results) => {
//         if (err) throw err;
    
//         // Parse Python output as JSON
//         const recommendations = JSON.parse(results[0]);
    
//         // Return recommendations as JSON response
//         res.json(recommendations);
//       });
//     }
    
//     // Start server
//     // app.listen(3000, () => {
//     //   console.log('Server started on port 3000');
//     // });
      
      
// }

