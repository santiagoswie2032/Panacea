require('dotenv').config();
console.log('--- ENV CHECK ---');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Exists' : 'MISSING');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Exists' : 'MISSING');
console.log('----------------');
