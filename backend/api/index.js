// Azure Static Web Apps API entry point
const path = require('path');

// Set the working directory to the backend root
process.chdir(path.join(__dirname, '..'));

// Start the Express server
require('../dist/app.js');
