// catch-all API endpoint for Vercel serverless functions
// simply re-export the Express app defined in the backend so that
// all /api/* requests are handled by the same server code.

const app = require('../backend/src/server');

module.exports = app;
