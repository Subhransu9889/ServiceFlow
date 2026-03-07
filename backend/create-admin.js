const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');

const connectDB = async () => {
  await mongoose.connect(process.env.MONOGDB_URL);
  console.log('DB connected...');
};

const createAdmin = async () => {
  try {
    let admin = await User.findOne({ email: 'admin@serviceflow.com' });
    if (!admin) {
      const hash = await bcrypt.hash('admin@123', 10);
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@serviceflow.com',
        phone: '+91 9999999999',
        password: hash,
        role: 'admin'
      });
      console.log('✓ Admin created');
    } else {
      console.log('✓ Admin already exists');
    }
    console.log('Email: admin@serviceflow.com');
    console.log('Password: admin@123');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

connectDB().then(() => createAdmin());
