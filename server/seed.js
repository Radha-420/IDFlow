const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();

    const users = [
      {
        role: 'admin',
        name: 'Admin User',
        email: 'admin@college.edu',
        password: 'password123', // Will be hashed in pre-save middleware
        photo: 'https://ui-avatars.com/api/?name=Admin+User&background=random',
      },
      {
        role: 'student',
        name: 'John Doe',
        email: 'john@student.edu',
        password: 'password123',
        collegeId: 'STU12345',
        department: 'Engineering',
        branch: 'Computer Science',
        year: '3rd Year',
        phone: '9876543210',
        photo: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
      },
      {
        role: 'student',
        name: 'Jane Smith',
        email: 'jane@student.edu',
        password: 'password123',
        collegeId: 'STU67890',
        department: 'Science',
        branch: 'Physics',
        year: '2nd Year',
        phone: '1234567890',
        photo: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random',
      }
    ];

    await User.insertMany(users);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
