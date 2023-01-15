const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.set('strictQuery', false).connect(process.env.DATABASE_URI);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
