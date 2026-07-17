const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const inspect = async () => {
  try {
    console.log("MONGO_URI loaded:", !!process.env.MONGO_URI);
console.log("NODE_ENV:", process.env.NODE_ENV);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    // Access the students collection directly without a strict schema to see what's in there
    const studentsCollection = mongoose.connection.collection('students');
    const docs = await studentsCollection.find({}).toArray();
    
    console.log('--- DOCUMENTS IN "students" COLLECTION ---');
    console.log(JSON.stringify(docs, null, 2));
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

inspect();
