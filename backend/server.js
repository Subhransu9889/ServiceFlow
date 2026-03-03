const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const port = process.env.PORT || 8000;

connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);

app.get("/", (req, res) => {
    res.send({
        message: "Hello ji welcome to service flow backend",
        status: "success"
    });
})
// console.log(process.env.PORT);

app.listen(port, () => {
    console.log(`port is running on port ${port}`);
})