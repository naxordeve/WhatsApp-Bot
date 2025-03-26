var config = require('../../config');
const mongoose = require('mongoose');

const connectDB = async () => {
    try { const conn = await mongoose.connect(config.MONGODB_URI);
        console.log('MongoDB Connected ✅');
        return conn;
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

module.exports = { connectDB };
