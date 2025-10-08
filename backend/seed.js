const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://soham:QvBmMZ52P2tiZ99y@cluster01.3lfyigv.mongodb.net/SAInT';
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoURI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log('MongoDB Connected:', conn.connection.host);
    console.log('Database Name:', conn.connection.name);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  {
    name: 'Soham Kulkarni',
    email: 'sohamsk93@gmail.com',
    password: 'soham123',
    role: 'admin',
    studentId: 'IT2021001',
    year: '4th',
    department: 'Information Technology',
    isActive: true
  },
  {
    name: 'John Doe',
    email: 'john.doe@university.edu',
    password: 'password123',
    role: 'student',
    studentId: 'CS2021001',
    year: '3rd',
    department: 'Computer Science',
    isActive: true
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@university.edu',
    password: 'password123',
    role: 'student',
    studentId: 'IT2021002',
    year: '2nd',
    department: 'Information Technology',
    isActive: true
  },
  {
    name: 'Alice Johnson',
    email: 'alice.johnson@university.edu',
    password: 'password123',
    role: 'student',
    studentId: 'ECE2021001',
    year: '1st',
    department: 'Electronics',
    isActive: true
  },
  {
    name: 'Bob Wilson',
    email: 'bob.wilson@university.edu',
    password: 'password123',
    role: 'student',
    studentId: 'MECH2021001',
    year: '4th',
    department: 'Mechanical',
    isActive: true
  }
];

const getSampleEvents = (adminUserId) => [
  {
    title: 'Web Development Workshop',
    description: 'Learn modern web development with React and Node.js',
    date: new Date('2025-11-15'),
    time: '10:00 AM',
    location: 'Computer Lab 1',
    category: 'Workshop',
    capacity: 30,
    registeredCount: 0,
    status: 'upcoming',
    speaker: {
      name: 'Soham Kulkarni',
      role: 'Senior Developer',
      company: 'SAInT',
      bio: 'Experienced full-stack developer with expertise in React and Node.js'
    },
    createdBy: adminUserId,
    isFeatured: true
  },
  {
    title: 'AI/ML Seminar',
    description: 'Introduction to Artificial Intelligence and Machine Learning',
    date: new Date('2025-11-20'),
    time: '2:00 PM',
    location: 'Auditorium',
    category: 'Seminar',
    capacity: 100,
    registeredCount: 0,
    status: 'upcoming',
    speaker: {
      name: 'Dr. Smith',
      role: 'Professor',
      company: 'University',
      bio: 'Expert in AI and Machine Learning research'
    },
    createdBy: adminUserId,
    isFeatured: false
  },
  {
    title: 'Coding Competition',
    description: 'Annual coding competition for all students',
    date: new Date('2025-10-05'),
    time: '9:00 AM',
    location: 'Computer Lab 2',
    category: 'Competition',
    capacity: 50,
    registeredCount: 45,
    status: 'completed',
    speaker: {
      name: 'Competition Team',
      role: 'Organizer',
      company: 'SAInT',
      bio: 'SAInT Competition organizing team'
    },
    createdBy: adminUserId,
    isFeatured: false
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Event.deleteMany({});
    
    console.log('Adding sample users...');
    const users = await User.create(sampleUsers);
    console.log(`Created ${users.length} users`);
    
    // Find the admin user to use as createdBy for events
    const adminUser = users.find(user => user.role === 'admin');
    
    console.log('Adding sample events...');
    const sampleEvents = getSampleEvents(adminUser._id);
    const events = await Event.create(sampleEvents);
    console.log(`Created ${events.length} events`);
    
    console.log('Database seeded successfully!');
    console.log('Users:', users.map(u => ({ name: u.name, email: u.email, role: u.role })));
    console.log('Events:', events.map(e => ({ title: e.title, date: e.date, status: e.status })));
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };