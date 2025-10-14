const mongoose = require('mongoose');
const Member = require('../models/Member');
require('dotenv').config();

// Core team members data from the provided image
const coreTeamMembers = [
  {
    name: "Mrunal Pawar",
    designation: "President",
    branch: "BTech",
    year: "Final Year",
    bio: "Leading SAInT's vision and strategic initiatives as President.",
    skills: ["Leadership", "Strategic Planning", "Project Management"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 1
  },
  {
    name: "Pradnya Patil",
    designation: "Vice-President", 
    branch: "BTech",
    year: "Final Year",
    bio: "Supporting the President and coordinating various club activities.",
    skills: ["Team Coordination", "Event Management", "Communication"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 2
  },
  {
    name: "Dr. Pallavi M. Tekade",
    designation: "Faculty Advisor",
    branch: "Faculty",
    year: "Faculty",
    bio: "Guiding and mentoring SAInT members in their technical journey.",
    skills: ["Academic Guidance", "Research", "Mentoring"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 3
  },
  {
    name: "Laukik Pagar",
    designation: "Director Administration",
    branch: "BTech", 
    year: "Final Year",
    bio: "Managing administrative affairs and organizational structure.",
    skills: ["Administration", "Organization", "Management"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 4
  },
  {
    name: "Ayush Panvekar",
    designation: "Secretary",
    branch: "BTech",
    year: "Final Year", 
    bio: "Handling documentation and official communications.",
    skills: ["Documentation", "Communication", "Record Keeping"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 5
  },
  {
    name: "Nikita Sonawane",
    designation: "Sponsorship",
    branch: "BTech",
    year: "Final Year",
    bio: "Managing sponsorships and external partnerships.",
    skills: ["Business Development", "Networking", "Partnerships"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 6
  },
  {
    name: "Sakshi Bhingardive",
    designation: "Sponsorship", 
    branch: "TY",
    year: "TY",
    bio: "Supporting sponsorship activities and partnership development.",
    skills: ["Sponsorship", "Communication", "Marketing"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 7
  },
  {
    name: "Swanand Talekar",
    designation: "Sponsorship",
    branch: "TY", 
    year: "TY",
    bio: "Contributing to sponsorship and funding initiatives.",
    skills: ["Fundraising", "Outreach", "Collaboration"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 8
  },
  {
    name: "Rohit Rasal",
    designation: "Sponsorship",
    branch: "TY",
    year: "TY", 
    bio: "Working on sponsorship strategies and implementation.",
    skills: ["Strategic Planning", "Partnership", "Negotiation"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 9
  },
  {
    name: "Rushikesh Chaudhari",
    designation: "Sponsorship",
    branch: "TY",
    year: "TY",
    bio: "Supporting team efforts in securing sponsorships.",
    skills: ["Team Support", "Sponsorship", "Communication"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 10
  },
  {
    name: "Prithviraj Zodge",
    designation: "Sponsorship", 
    branch: "TY",
    year: "TY",
    bio: "Contributing to sponsorship and funding activities.",
    skills: ["Funding", "Outreach", "Partnership"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 11
  },
  {
    name: "Vaibhav Patil",
    designation: "Media",
    branch: "BTech",
    year: "Final Year",
    bio: "Managing media content and digital presence.",
    skills: ["Content Creation", "Social Media", "Digital Marketing"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 12
  },
  {
    name: "Subodh Jagtap",
    designation: "Media",
    branch: "TY", 
    year: "TY",
    bio: "Supporting media operations and content development.",
    skills: ["Content Development", "Media Management", "Design"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 13
  },
  {
    name: "Pradyumn Bhosale",
    designation: "Media",
    branch: "TY",
    year: "TY",
    bio: "Contributing to media strategies and content creation.",
    skills: ["Creative Content", "Media Strategy", "Graphics"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 14
  },
  {
    name: "Atharva Jadhav",
    designation: "Media", 
    branch: "TY",
    year: "TY",
    bio: "Working on media content and promotional materials.",
    skills: ["Promotion", "Content", "Media Production"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 15
  },
  {
    name: "Vedant Kale",
    designation: "Media",
    branch: "TY",
    year: "TY",
    bio: "Supporting media team with creative initiatives.",
    skills: ["Creativity", "Media Support", "Innovation"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 16
  },
  {
    name: "Atharva Bakshi",
    designation: "Joint Secretary",
    branch: "BTech",
    year: "Final Year",
    bio: "Assisting in secretarial duties and documentation.",
    skills: ["Documentation", "Coordination", "Support"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 17
  },
  {
    name: "Aryan Thite",
    designation: "Joint Secretary",
    branch: "TY", 
    year: "TY",
    bio: "Supporting secretarial functions and administrative tasks.",
    skills: ["Administration", "Support", "Organization"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 18
  },
  {
    name: "Jitesh Bagale",
    designation: "Joint Secretary",
    branch: "TY",
    year: "TY",
    bio: "Contributing to administrative and secretarial activities.",
    skills: ["Administration", "Team Support", "Coordination"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 19
  },
  {
    name: "Himanshu Dhumal",
    designation: "Treasurer",
    branch: "BTech",
    year: "Final Year",
    bio: "Managing financial affairs and budget planning.",
    skills: ["Financial Management", "Budget Planning", "Accounting"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 20
  },
  {
    name: "Siddhi Pokale",
    designation: "Treasurer",
    branch: "TY", 
    year: "TY",
    bio: "Assisting in financial management and treasury functions.",
    skills: ["Financial Support", "Treasury", "Budget Tracking"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 21
  },
  {
    name: "Sakshi Tirmanwar",
    designation: "Lady Representative",
    branch: "BTech",
    year: "Final Year",
    bio: "Representing and advocating for women members in SAInT.",
    skills: ["Advocacy", "Representation", "Women Empowerment"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 22
  },
  {
    name: "Ojal Zope",
    designation: "Lady Representative", 
    branch: "BTech",
    year: "Final Year",
    bio: "Supporting women's initiatives and inclusive participation.",
    skills: ["Inclusion", "Women's Leadership", "Community Building"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 23
  },
  {
    name: "Gauri Talokar",
    designation: "Lady Representative",
    branch: "TY",
    year: "TY",
    bio: "Promoting women's participation in technical activities.",
    skills: ["Technical Advocacy", "Community Engagement", "Support"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 24
  },
  {
    name: "Harshad Warokar",
    designation: "Management",
    branch: "BTech",
    year: "Final Year",
    bio: "Managing operational activities and team coordination.",
    skills: ["Operations Management", "Team Leadership", "Coordination"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 25
  },
  {
    name: "Kaushal Shelkar",
    designation: "Management", 
    branch: "BTech",
    year: "Final Year",
    bio: "Supporting management functions and strategic planning.",
    skills: ["Strategic Management", "Planning", "Execution"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 26
  },
  {
    name: "Prasad Bhatlawande",
    designation: "Management",
    branch: "TY",
    year: "TY",
    bio: "Contributing to management activities and organizational development.",
    skills: ["Organization", "Management Support", "Development"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 27
  },
  {
    name: "Nakul Firodiya",
    designation: "Management",
    branch: "TY", 
    year: "TY",
    bio: "Supporting management initiatives and team activities.",
    skills: ["Team Management", "Initiative Support", "Coordination"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 28
  },
  {
    name: "Soham Gujar",
    designation: "Management",
    branch: "TY",
    year: "TY",
    bio: "Contributing to management and organizational efficiency.",
    skills: ["Efficiency", "Organization", "Process Improvement"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 29
  },
  {
    name: "Sherni Pandit",
    designation: "Representative",
    branch: "TY",
    year: "TY",
    bio: "Representing student interests and facilitating communication.",
    skills: ["Student Advocacy", "Communication", "Representation"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 30
  },
  {
    name: "Gayatri Kadam",
    designation: "Representative", 
    branch: "TY",
    year: "TY",
    bio: "Supporting student representation and community engagement.",
    skills: ["Community Engagement", "Student Support", "Advocacy"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 31
  },
  {
    name: "Pankaj Tikone",
    designation: "Representative",
    branch: "TY",
    year: "TY",
    bio: "Contributing to student representation and club activities.",
    skills: ["Student Relations", "Activity Support", "Engagement"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 32
  },
  {
    name: "Anushka Zakapure",
    designation: "Representative",
    branch: "TY", 
    year: "TY",
    bio: "Supporting representative functions and student advocacy.",
    skills: ["Advocacy", "Student Support", "Representation"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 33
  },
  {
    name: "Leena Khairnar",
    designation: "Representative",
    branch: "TY",
    year: "TY",
    bio: "Contributing to student representation and community building.",
    skills: ["Community Building", "Student Engagement", "Support"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 34
  },
  {
    name: "Rutuja Pawar",
    designation: "Representative",
    branch: "TY",
    year: "TY",
    bio: "Supporting representative activities and student initiatives.",
    skills: ["Student Initiatives", "Support", "Collaboration"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 35
  },
  {
    name: "Shubham Jadhav",
    designation: "Representative", 
    branch: "TY",
    year: "TY",
    bio: "Contributing to representative duties and student welfare.",
    skills: ["Student Welfare", "Representative Duties", "Support"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 36
  },
  {
    name: "Ritesh Wadurkar",
    designation: "Representative",
    branch: "TY",
    year: "TY",
    bio: "Supporting student representation and organizational activities.",
    skills: ["Organization", "Student Representation", "Activity Support"],
    isActive: true,
    isCoreTeam: true,
    displayOrder: 37
  }
];

async function populateCoreTeamMembers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing core team members
    await Member.deleteMany({ isCoreTeam: true });
    console.log('🧹 Cleared existing core team members');

    // Insert new core team members
    const insertedMembers = await Member.insertMany(coreTeamMembers);
    console.log(`✅ Successfully added ${insertedMembers.length} core team members`);

    console.log('\n📋 Core Team Members Added:');
    insertedMembers.forEach((member, index) => {
      console.log(`${index + 1}. ${member.name} - ${member.designation}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating core team members:', error);
    process.exit(1);
  }
}

// Run the population script
if (require.main === module) {
  populateCoreTeamMembers();
}

module.exports = { coreTeamMembers, populateCoreTeamMembers };