// Database Seeder for LMS Project
// File: server/scripts/seed.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
import { User } from '../models/user.model.js';
import { Course } from '../models/course.model.js';
import { Lecture } from '../models/lecture.model.js';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Lecture.deleteMany({});
    console.log('✅ Cleared existing data');

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('12345qwert', 10);

    // Create Instructors
    console.log('\n👨‍🏫 Creating instructors...');
    const instructors = await User.insertMany([
      {
        name: 'Alice Instructor',
        email: 'alice.instructor@example.com',
        password: hashedPassword,
        role: 'instructor',
        photoUrl: 'https://i.pravatar.cc/300?img=1',
        enrolledCourses: []
      },
      {
        name: 'Bob Instructor',
        email: 'bob.instructor@example.com',
        password: hashedPassword,
        role: 'instructor',
        photoUrl: 'https://i.pravatar.cc/300?img=12',
        enrolledCourses: []
      },
      {
        name: 'Carol Instructor',
        email: 'carol.instructor@example.com',
        password: hashedPassword,
        role: 'instructor',
        photoUrl: 'https://i.pravatar.cc/300?img=5',
        enrolledCourses: []
      }
    ]);
    console.log(`✅ Created ${instructors.length} instructors`);

    // Create Students
    console.log('\n👨‍🎓 Creating students...');
    const students = await User.insertMany([
      {
        name: 'Dave Student',
        email: 'dave.student@example.com',
        password: hashedPassword,
        role: 'student',
        photoUrl: 'https://i.pravatar.cc/300?img=33',
        enrolledCourses: []
      },
      {
        name: 'Eve Student',
        email: 'eve.student@example.com',
        password: hashedPassword,
        role: 'student',
        photoUrl: 'https://i.pravatar.cc/300?img=9',
        enrolledCourses: []
      },
      {
        name: 'Frank Student',
        email: 'frank.student@example.com',
        password: hashedPassword,
        role: 'student',
        photoUrl: 'https://i.pravatar.cc/300?img=15',
        enrolledCourses: []
      }
    ]);
    console.log(`✅ Created ${students.length} students`);

    // Sample video URLs
    const videoUrls = [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
    ];

    // Course Data with Lectures
    console.log('\n📚 Creating courses and lectures...');
    const coursesData = [
      {
        courseTitle: 'Complete Web Development Bootcamp',
        subTitle: 'Master web development from scratch',
        description: 'Learn HTML, CSS, JavaScript, React, Node.js, and deploy real-world projects.',
        category: 'Web Development',
        courseLevel: 'Beginner',
        coursePrice: 2999,
        courseThumbnail: 'https://picsum.photos/seed/course1/800/450',
        creator: instructors[0]._id,
        isPublished: true,
        enrolledStudents: [],
        lectures: [
          {
            lectureTitle: 'Introduction to Web Development',
            videoUrl: videoUrls[0],
            publicId: 'sample_video_1',
            isPreviewFree: true
          },
          {
            lectureTitle: 'HTML Fundamentals',
            videoUrl: videoUrls[1],
            publicId: 'sample_video_2',
            isPreviewFree: true
          },
          {
            lectureTitle: 'CSS Styling Basics',
            videoUrl: videoUrls[2],
            publicId: 'sample_video_3',
            isPreviewFree: false
          },
          {
            lectureTitle: 'JavaScript Fundamentals',
            videoUrl: videoUrls[3],
            publicId: 'sample_video_4',
            isPreviewFree: false
          }
        ]
      },
      {
        courseTitle: 'Python for Data Science',
        subTitle: 'Learn Python programming and data analysis',
        description: 'Dive into data analysis, visualization, and machine learning fundamentals using Python.',
        category: 'Data Science',
        courseLevel: 'Medium',
        coursePrice: 3499,
        courseThumbnail: 'https://picsum.photos/seed/course2/800/450',
        creator: instructors[1]._id,
        isPublished: true,
        enrolledStudents: [],
        lectures: [
          {
            lectureTitle: 'Python Basics and Setup',
            videoUrl: videoUrls[4],
            publicId: 'sample_video_5',
            isPreviewFree: true
          },
          {
            lectureTitle: 'Data Structures in Python',
            videoUrl: videoUrls[5],
            publicId: 'sample_video_6',
            isPreviewFree: false
          },
          {
            lectureTitle: 'NumPy and Pandas',
            videoUrl: videoUrls[6],
            publicId: 'sample_video_7',
            isPreviewFree: false
          }
        ]
      },
      {
        courseTitle: 'React - The Complete Guide',
        subTitle: 'Master React.js with hooks and context',
        description: 'Build modern, reactive user interfaces with React hooks, context, Redux.',
        category: 'Web Development',
        courseLevel: 'Medium',
        coursePrice: 2799,
        courseThumbnail: 'https://picsum.photos/seed/course3/800/450',
        creator: instructors[0]._id,
        isPublished: true,
        enrolledStudents: [],
        lectures: [
          {
            lectureTitle: 'What is React?',
            videoUrl: videoUrls[7],
            publicId: 'sample_video_8',
            isPreviewFree: true
          },
          {
            lectureTitle: 'Components and Props',
            videoUrl: videoUrls[8],
            publicId: 'sample_video_9',
            isPreviewFree: false
          },
          {
            lectureTitle: 'React Hooks',
            videoUrl: videoUrls[9],
            publicId: 'sample_video_10',
            isPreviewFree: false
          }
        ]
      },
      {
        courseTitle: 'Machine Learning A-Z',
        subTitle: 'Complete machine learning course',
        description: 'Learn supervised and unsupervised learning algorithms with real-world projects.',
        category: 'Data Science',
        courseLevel: 'Advance',
        coursePrice: 4999,
        courseThumbnail: 'https://picsum.photos/seed/course4/800/450',
        creator: instructors[1]._id,
        isPublished: true,
        enrolledStudents: [],
        lectures: [
          {
            lectureTitle: 'Machine Learning Basics',
            videoUrl: videoUrls[10],
            publicId: 'sample_video_11',
            isPreviewFree: true
          },
          {
            lectureTitle: 'Supervised Learning',
            videoUrl: videoUrls[11],
            publicId: 'sample_video_12',
            isPreviewFree: false
          },
          {
            lectureTitle: 'Unsupervised Learning',
            videoUrl: videoUrls[0],
            publicId: 'sample_video_13',
            isPreviewFree: false
          }
        ]
      },
      {
        courseTitle: 'Node.js and Express Masterclass',
        subTitle: 'Build scalable backend applications',
        description: 'Master server-side development with Node.js and Express framework.',
        category: 'Web Development',
        courseLevel: 'Medium',
        coursePrice: 3299,
        courseThumbnail: 'https://picsum.photos/seed/course5/800/450',
        creator: instructors[2]._id,
        isPublished: true,
        enrolledStudents: [],
        lectures: [
          {
            lectureTitle: 'Node.js Fundamentals',
            videoUrl: videoUrls[1],
            publicId: 'sample_video_14',
            isPreviewFree: true
          },
          {
            lectureTitle: 'Express Basics',
            videoUrl: videoUrls[2],
            publicId: 'sample_video_15',
            isPreviewFree: false
          },
          {
            lectureTitle: 'Building REST APIs',
            videoUrl: videoUrls[3],
            publicId: 'sample_video_16',
            isPreviewFree: false
          }
        ]
      },
      {
        courseTitle: 'Deep Learning with TensorFlow',
        subTitle: 'Advanced deep learning course',
        description: 'Build neural networks and deep learning models using TensorFlow.',
        category: 'Data Science',
        courseLevel: 'Advance',
        coursePrice: 4299,
        courseThumbnail: 'https://picsum.photos/seed/course6/800/450',
        creator: instructors[1]._id,
        isPublished: true,
        enrolledStudents: [],
        lectures: [
          {
            lectureTitle: 'Neural Networks Intro',
            videoUrl: videoUrls[4],
            publicId: 'sample_video_17',
            isPreviewFree: true
          },
          {
            lectureTitle: 'Convolutional Neural Networks',
            videoUrl: videoUrls[5],
            publicId: 'sample_video_18',
            isPreviewFree: false
          },
          {
            lectureTitle: 'Recurrent Neural Networks',
            videoUrl: videoUrls[6],
            publicId: 'sample_video_19',
            isPreviewFree: false
          }
        ]
      },
      {
        courseTitle: 'UI/UX Design Fundamentals',
        subTitle: 'Master user interface and experience design',
        description: 'Learn principles of user interface and user experience design.',
        category: 'Design',
        courseLevel: 'Beginner',
        coursePrice: 1999,
        courseThumbnail: 'https://picsum.photos/seed/course7/800/450',
        creator: instructors[0]._id,
        isPublished: true,
        enrolledStudents: [],
        lectures: [
          {
            lectureTitle: 'Introduction to UI/UX Design',
            videoUrl: videoUrls[7],
            publicId: 'sample_video_20',
            isPreviewFree: true
          },
          {
            lectureTitle: 'Design Thinking Process',
            videoUrl: videoUrls[8],
            publicId: 'sample_video_21',
            isPreviewFree: true
          },
          {
            lectureTitle: 'User Research Methods',
            videoUrl: videoUrls[9],
            publicId: 'sample_video_22',
            isPreviewFree: false
          }
        ]
      },
      {
        courseTitle: 'Figma for Designers',
        subTitle: 'Master Figma from basics to advanced',
        description: 'Create professional designs, interactive prototypes, and design systems using Figma.',
        category: 'Design Tools',
        courseLevel: 'Beginner',
        coursePrice: 1999,
        courseThumbnail: 'https://picsum.photos/seed/course8/800/450',
        creator: instructors[2]._id,
        isPublished: true,
        enrolledStudents: [],
        lectures: [
          {
            lectureTitle: 'Getting Started with Figma',
            videoUrl: videoUrls[10],
            publicId: 'sample_video_23',
            isPreviewFree: true
          },
          {
            lectureTitle: 'Frames and Layers',
            videoUrl: videoUrls[11],
            publicId: 'sample_video_24',
            isPreviewFree: false
          },
          {
            lectureTitle: 'Auto Layout Mastery',
            videoUrl: videoUrls[0],
            publicId: 'sample_video_25',
            isPreviewFree: false
          }
        ]
      },
      {
        courseTitle: 'Advanced Design Systems',
        subTitle: 'Build scalable design systems',
        description: 'Create component libraries and maintain design consistency across products.',
        category: 'Design',
        courseLevel: 'Advance',
        coursePrice: 3999,
        courseThumbnail: 'https://picsum.photos/seed/course9/800/450',
        creator: instructors[2]._id,
        isPublished: true,
        enrolledStudents: [],
        lectures: [
          {
            lectureTitle: 'What are Design Systems?',
            videoUrl: videoUrls[1],
            publicId: 'sample_video_26',
            isPreviewFree: true
          },
          {
            lectureTitle: 'Building Component Libraries',
            videoUrl: videoUrls[2],
            publicId: 'sample_video_27',
            isPreviewFree: false
          },
          {
            lectureTitle: 'Design Tokens and Variables',
            videoUrl: videoUrls[3],
            publicId: 'sample_video_28',
            isPreviewFree: false
          }
        ]
      },
      {
        courseTitle: 'Full Stack JavaScript Development',
        subTitle: 'Master MERN stack development',
        description: 'Become a full-stack developer using MongoDB, Express, React, and Node.js.',
        category: 'Full Stack',
        courseLevel: 'Advance',
        coursePrice: 4499,
        courseThumbnail: 'https://picsum.photos/seed/course10/800/450',
        creator: instructors[0]._id,
        isPublished: true,
        enrolledStudents: [],
        lectures: [
          {
            lectureTitle: 'MERN Stack Overview',
            videoUrl: videoUrls[4],
            publicId: 'sample_video_29',
            isPreviewFree: true
          },
          {
            lectureTitle: 'Setting Up MongoDB',
            videoUrl: videoUrls[5],
            publicId: 'sample_video_30',
            isPreviewFree: false
          },
          {
            lectureTitle: 'Building REST APIs with Express',
            videoUrl: videoUrls[6],
            publicId: 'sample_video_31',
            isPreviewFree: false
          },
          {
            lectureTitle: 'React Frontend Integration',
            videoUrl: videoUrls[7],
            publicId: 'sample_video_32',
            isPreviewFree: false
          }
        ]
      }
    ];

    // Create Courses with Lectures
    let totalLectures = 0;
    const createdCourses = [];
    
    for (const courseData of coursesData) {
      // Extract lectures data
      const lecturesData = courseData.lectures;
      delete courseData.lectures;

      // Create course
      const course = await Course.create(courseData);
      createdCourses.push(course);

      // Create lectures for this course
      const lectures = [];
      for (const lectureData of lecturesData) {
        const lecture = await Lecture.create({
          ...lectureData,
          course: course._id
        });
        lectures.push(lecture._id);
        totalLectures++;
      }

      // Update course with lecture IDs
      course.lectures = lectures;
      await course.save();
      console.log(`   ✓ ${course.courseTitle} (${lectures.length} lectures)`);
    }

    // Update students' enrolledCourses and course enrolledStudents
    console.log('\n📝 Enrolling students in courses...');
    
    // Dave Student enrolled in courses 0, 2, 4, 6, 8
    const daveCourses = [
      createdCourses[0]._id,
      createdCourses[2]._id,
      createdCourses[4]._id,
      createdCourses[6]._id,
      createdCourses[8]._id
    ];
    await User.findByIdAndUpdate(students[0]._id, {
      enrolledCourses: daveCourses
    });
    for (const courseId of daveCourses) {
      await Course.findByIdAndUpdate(courseId, {
        $push: { enrolledStudents: students[0]._id }
      });
    }
    console.log(`   ✓ Dave Student enrolled in ${daveCourses.length} courses`);

    // Eve Student enrolled in courses 1, 3, 5, 7, 9
    const eveCourses = [
      createdCourses[1]._id,
      createdCourses[3]._id,
      createdCourses[5]._id,
      createdCourses[7]._id,
      createdCourses[9]._id
    ];
    await User.findByIdAndUpdate(students[1]._id, {
      enrolledCourses: eveCourses
    });
    for (const courseId of eveCourses) {
      await Course.findByIdAndUpdate(courseId, {
        $push: { enrolledStudents: students[1]._id }
      });
    }
    console.log(`   ✓ Eve Student enrolled in ${eveCourses.length} courses`);

    // Frank Student enrolled in courses 0, 1, 2, 3, 4, 5
    const frankCourses = [
      createdCourses[0]._id,
      createdCourses[1]._id,
      createdCourses[2]._id,
      createdCourses[3]._id,
      createdCourses[4]._id,
      createdCourses[5]._id
    ];
    await User.findByIdAndUpdate(students[2]._id, {
      enrolledCourses: frankCourses
    });
    for (const courseId of frankCourses) {
      await Course.findByIdAndUpdate(courseId, {
        $push: { enrolledStudents: students[2]._id }
      });
    }
    console.log(`   ✓ Frank Student enrolled in ${frankCourses.length} courses`);

    console.log('='.repeat(60));
    console.log('\n✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('='.repeat(60));

    console.log('\n📊 Summary:');
    console.log(`   • ${instructors.length} Instructors created`);
    console.log(`   • ${students.length} Students created`);
    console.log(`   • ${createdCourses.length} Courses created`);
    console.log(`   • ${totalLectures} Lectures created with video URLs`);
    console.log(`   • All courses are published`);
    console.log(`   • Students enrolled in multiple courses`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('   Password for all users: 12345qwert');
    
    console.log('\n👨‍🏫 Instructors:');
    instructors.forEach(instructor => {
      console.log(`   • ${instructor.email}`);
    });
    
    console.log('\n👨‍🎓 Students:');
    students.forEach(student => {
      console.log(`   • ${student.email}`);
    });

    console.log('\n💡 Next Steps:');
    console.log('   1. Start your server: npm run dev');
    console.log('   2. Login with any of the above credentials');
    console.log('   3. Explore courses, lectures, and user profiles');
    console.log('='.repeat(60) + '\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
