const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONOGDB_URL).then(() => {
            console.log('DB connected.....');
            
        })

    } catch(error){
        console.error(error);
        throw new Error("Error connecting to database");
    }
}

module.exports = connectDB;