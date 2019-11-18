const mongoose = require('mongoose');
const config = require('config');

// Get MongoDB connection String
const db = config.get('mongoURI');

// Connect to Database
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log('MongoDB Connected..............');
  } catch (err) {
    console.error(err.message);
    //Exit Process with Failure
    process.exit(1);
  }
};

// Export Connection

module.exports = connectDB;
