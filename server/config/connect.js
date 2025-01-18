const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose.connect(url)
  .then(() => {
      console.log('Connected to MongoDB successfully',mongoose.connection.host);
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err.message);
      process.exit(1)
    });

};

module.exports = connectDB;
