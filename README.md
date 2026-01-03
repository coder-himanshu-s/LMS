# E-Learning Platform - Server

A robust Node.js/Express backend API for the E-Learning LMS platform with MongoDB for data persistence, Razorpay for payments, and Cloudinary for media storage.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Authentication](#authentication)
- [Payment Integration](#payment-integration)
- [Error Handling](#error-handling)

## ✨ Features

### User Management
- User registration with role selection (Student/Instructor)
- Secure login with JWT authentication
- User profile management
- Password hashing with bcrypt
- Profile picture upload support

### Course Management
- Create, read, update, delete courses
- Course publishing and status management
- Course categorization and filtering
- Student enrollment tracking
- Instructor-specific course management

### Lecture Management
- Add lectures to courses
- Video upload to Cloudinary
- Lecture preview mode (free/paid)
- Lecture deletion and editing
- Sequential lecture ordering

### Payment Processing
- Razorpay order creation
- Secure payment verification with HMAC-SHA256
- Purchase tracking and history
- Automatic student enrollment on successful payment
- Course access management after purchase

### Learning Progress
- Track student progress per course
- Mark lectures as completed
- Calculate course completion percentage
- Cumulative lecture marking (mark lecture marks all prior lectures)
- Progress history

### File Management
- Video uploads to Cloudinary
- Secure file upload handling
- Temporary file cleanup
- Multer middleware for multipart form data

## 🛠 Tech Stack

### Runtime & Framework
- **Node.js**: JavaScript runtime
- **Express.js**: Minimal web framework
- **Dotenv**: Environment variable management

### Database
- **MongoDB**: NoSQL document database
- **Mongoose**: MongoDB object modeling
- **MongoDB Compass**: Database GUI (development)

### Authentication & Security
- **JWT (jsonwebtoken)**: Token-based authentication
- **Bcrypt**: Password hashing
- **CORS**: Cross-origin resource sharing
- **Cookie Parser**: HTTP cookie parsing

### Payment & Media
- **Razorpay**: Payment gateway integration
- **Cloudinary**: Cloud media storage
- **Crypto**: HMAC-SHA256 signature verification

### File Upload
- **Multer**: Middleware for file uploads
- **UUID**: Unique file naming

### Development Tools
- **Nodemon**: Auto-restart on file changes
- **Concurrently**: Run multiple processes

## 📁 Project Structure

```
server/
├── controllers/              # Business logic
│   ├── course.controller.js
│   ├── courseProgress.controller.js
│   ├── coursePurchase.controller.js
│   └── user.controller.js
├── models/                  # Database schemas
│   ├── course.model.js
│   ├── courseProgress.js
│   ├── coursePurchase.model.js
│   ├── lecture.model.js
│   └── user.model.js
├── routes/                  # API routes
│   ├── course.route.js
│   ├── courseProgress.route.js
│   ├── media.route.js
│   ├── purchaseCourse.route.js
│   └── user.route.js
├── middlewares/             # Custom middleware
│   └── isAuthenticated.js
├── database/
│   └── db.js
├── utils/
│   ├── cloudinary.js
│   ├── generateToken.js
│   └── multer.js
├── uploads/                 # Temporary upload folder
├── .env                     # Environment variables
├── index.js                 # Server entry point
└── package.json
```

## 📦 Installation

### Prerequisites
- Node.js 14+ and npm/yarn
- MongoDB local or Atlas
- Cloudinary account
- Razorpay account
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd lms/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file** (see [Environment Variables](#environment-variables))
   ```bash
   touch .env
   ```

4. **Verify database connection**
   ```bash
   # MongoDB should be running locally or accessible via Atlas connection string
   ```

## 🔧 Environment Variables

Create a `.env` file in the `server` root directory:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/elearning
# OR for MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elearning?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary (Video & Media Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (Payment Gateway)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=rzp_test_secret_xxxxxxxxxxxxx

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Variable Description

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/elearning` |
| `JWT_SECRET` | Secret key for JWT signing | Any secure random string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | From Cloudinary dashboard |
| `RAZORPAY_KEY_ID` | Razorpay public key | From Razorpay dashboard |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key | From Razorpay dashboard |
| `CORS_ORIGIN` | Client origin for CORS | `http://localhost:5173` |

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```
- Starts server with Nodemon
- Auto-restarts on file changes
- Usually runs on `http://localhost:8080`

### Production Mode
```bash
npm start
```
- Runs server in production mode
- Use after `npm run build` (if applicable)

### With Concurrently (Optional)
```bash
npm run dev:all
```
- Runs both server and client simultaneously

## 📡 API Endpoints

### Authentication (`/api/v1/user`)

**Register User**
```http
POST /register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"  // or "instructor"
}
```

**Login User**
```http
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Logout User**
```http
POST /logout
```

**Get User Profile**
```http
GET /profile
Headers: Authorization: Bearer <token>
```

---

### Courses (`/api/v1/course`)

**Get All Published Courses**
```http
GET /published-courses
```

**Get Course by ID**
```http
GET /:courseId
```

**Search Courses**
```http
GET /search?query=javascript&category=programming&price=asc
```

**Create Course (Instructor)**
```http
POST /
Content-Type: application/json
Headers: Authorization: Bearer <token>

{
  "courseTitle": "JavaScript Basics",
  "subTitle": "Learn JS from scratch",
  "description": "Complete guide to JavaScript",
  "category": "Programming",
  "courseLevel": "Beginner",
  "coursePrice": 2999
}
```

**Update Course (Instructor)**
```http
PUT /:courseId
Content-Type: application/json
Headers: Authorization: Bearer <token>
```

**Publish Course (Instructor)**
```http
PATCH /:courseId/publish
Headers: Authorization: Bearer <token>
```

---

### Lectures (`/api/v1/course/:courseId/lecture`)

**Get Course Lectures**
```http
GET /
```

**Create Lecture (Instructor)**
```http
POST /
Content-Type: application/json
Headers: Authorization: Bearer <token>

{
  "lectureTitle": "Introduction"
}
```

**Get Lecture by ID**
```http
GET /:lectureId
```

**Edit Lecture (Instructor)**
```http
PATCH /:lectureId
Content-Type: application/json
Headers: Authorization: Bearer <token>

{
  "lectureTitle": "Updated Title",
  "videoInfo": {
    "videoUrl": "https://res.cloudinary.com/...",
    "publicId": "video_id"
  },
  "isPreviewFree": true
}
```

**Delete Lecture (Instructor)**
```http
DELETE /:lectureId
Headers: Authorization: Bearer <token>
```

---

### Purchases (`/api/v1/purchase`)

**Create Order (for Payment)**
```http
POST /create-order
Content-Type: application/json
Headers: Authorization: Bearer <token>

{
  "courseId": "60d5ec49c1234567890abcde"
}
```

**Verify Payment**
```http
POST /verify-payment
Content-Type: application/json

{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx"
}
```

**Get Purchased Courses**
```http
GET /
Headers: Authorization: Bearer <token>
```

---

### Progress (`/api/v1/progress`)

**Get Course Progress**
```http
GET /:courseId
Headers: Authorization: Bearer <token>
```

**Mark Lecture as Viewed**
```http
POST /:courseId/lecture/:lectureId/view
Headers: Authorization: Bearer <token>
```

**Mark Course as Completed**
```http
POST /:courseId/complete
Headers: Authorization: Bearer <token>
```

**Mark Course as Incomplete**
```http
POST /:courseId/incomplete
Headers: Authorization: Bearer <token>
```

---

### Media (`/api/v1/media`)

**Upload Video**
```http
POST /upload-video
Content-Type: multipart/form-data

file: <video_file>
```

---

## 💾 Database Models

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["student", "instructor"], default: "student"),
  enrolledCourses: [ObjectId] (ref: Course),
  photoUrl: String (default: ""),
  createdAt: Date,
  updatedAt: Date
}
```

### Course Schema
```javascript
{
  courseTitle: String (required),
  subTitle: String,
  description: String,
  category: String (required),
  courseLevel: String (enum: ["Beginner", "Medium", "Advance"]),
  coursePrice: Number,
  courseThumbnail: String,
  creator: ObjectId (ref: User),
  lectures: [ObjectId] (ref: Lecture),
  enrolledStudents: [ObjectId] (ref: User),
  isPublished: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Lecture Schema
```javascript
{
  lectureTitle: String (required),
  videoInfo: {
    videoUrl: String,
    publicId: String
  },
  isPreviewFree: Boolean (default: false),
  course: ObjectId (ref: Course),
  createdAt: Date,
  updatedAt: Date
}
```

### CoursePurchase Schema
```javascript
{
  courseId: ObjectId (ref: Course),
  userId: ObjectId (ref: User),
  amount: Number,
  status: String (enum: ["pending", "completed"], default: "pending"),
  paymentId: String (Razorpay order/payment ID),
  createdAt: Date,
  updatedAt: Date
}
```

### CourseProgress Schema
```javascript
{
  userId: ObjectId (ref: User),
  courseId: ObjectId (ref: Course),
  completed: Boolean (default: false),
  lectureProgress: [
    {
      lectureId: ObjectId,
      viewed: Boolean
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication

### JWT Flow
1. User registers/logs in
2. Server generates JWT token with user ID
3. Token stored in HTTP-only cookie
4. Client sends token in Authorization header
5. `isAuthenticated` middleware verifies token
6. User ID extracted and attached to request

### Protected Routes
- All endpoints except `/register` and `/login` require authentication
- Admin routes check `role === "instructor"`

## 💳 Payment Integration

### Razorpay Flow
1. **Order Creation** (`/create-order`)
   - Receives `courseId`
   - Creates Razorpay order with course price
   - Stores pending purchase record
   - Returns order details to client

2. **Payment Modal** (Client-side)
   - Client opens Razorpay checkout modal
   - User enters payment details
   - Razorpay handles payment processing

3. **Payment Verification** (`/verify-payment`)
   - Receives Razorpay order ID, payment ID, and signature
   - Verifies signature using HMAC-SHA256
   - Updates purchase status to "completed"
   - Enrolls student in course
   - Updates course's `enrolledStudents` list

### Signature Verification
```javascript
// Server verifies: HMAC-SHA256(order_id|payment_id, secret) === signature
// Ensures payment authenticity
```

## 🎥 Media Upload

### Cloudinary Integration
- Video uploads handled by Cloudinary
- Temporary files stored in `uploads/` folder
- After upload, temporary files cleaned up
- Cloudinary URL and public ID stored in database

### Multer Configuration
- Accepts video files only
- Limits file size (configurable)
- Stores in `uploads/` directory temporarily

## ⚠️ Error Handling

### Error Codes
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

### Common Errors
- Missing required fields
- Invalid course/user ID
- Duplicate email registration
- Payment verification failed
- Video upload failed
- Unauthorized course access

## 🔄 Middleware

### `isAuthenticated`
- Verifies JWT token from cookies
- Extracts and validates user ID
- Attaches user ID to request object
- Returns 401 if token invalid

## 📝 Development Notes

1. **CORS Configuration**: Adjust `CORS_ORIGIN` for production
2. **JWT Secret**: Use strong random string in production
3. **Cloudinary**: Sign up free at [cloudinary.com](https://cloudinary.com)
4. **Razorpay**: Test mode keys provided; switch to live keys for production
5. **MongoDB**: Use Atlas for cloud hosting or local MongoDB

## 🚀 Deployment

### Environment Setup
1. Create `.env` with production values
2. Set `NODE_ENV=production`
3. Update `CORS_ORIGIN` to production client URL
4. Use production Razorpay keys

### Hosting Options
- Heroku, Railway, Render, AWS EC2, DigitalOcean, etc.

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [Razorpay Documentation](https://razorpay.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [JWT Documentation](https://jwt.io)

## 🐛 Debugging

### Logs
- Check console output for error messages
- Use `console.log` for debugging
- Monitor network requests in client DevTools

### MongoDB
- Use MongoDB Compass to inspect data
- Check collections and documents
- Verify indexes

### Razorpay
- Use test mode credentials
- Check Razorpay dashboard for orders
- Verify signature in server logs

## 👨‍💻 Development Tips

1. Test all endpoints with Postman or Insomnia
2. Monitor MongoDB changes in real-time with Compass
3. Check Cloudinary uploads in dashboard
4. Verify JWT tokens at [jwt.io](https://jwt.io)
5. Test payment flow with Razorpay test cards

---

**Last Updated**: December 2024
**Version**: 1.0.0
