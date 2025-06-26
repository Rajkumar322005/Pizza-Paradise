const mongoose = require('mongoose');
const config = require('./src/env');

console.log('Attempting to connect to MongoDB...');
console.log('Connection URI:', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('✓ Successfully connected to MongoDB!');
    console.log('Database name:', mongoose.connection.name);
    process.exit(0);
  })
  .catch(err => {
    console.error('✗ MongoDB connection error:', err);
    process.exit(1);
  }); 