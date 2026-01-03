import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const purchaseCourse = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const options = {
      amount: course.coursePrice * 100, // Convert to paisa
      currency: "INR",
      receipt: `receipt${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).json({
        success: false,
        message: "Failed to create order",
      });
    }

    // Create an entry in CoursePurchase with `pending` status
    const newPurchase = await CoursePurchase.create({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
      paymentId: order.id, // Store Razorpay order ID
    });

    res.status(200).json({
      success: true,
      order,
      purchaseId: newPurchase._id, // Send purchase entry ID for tracking
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in payment purchaseCourse",
      error: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    console.log("Received request body for validation:", req.body);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
      });
    }

    // Verify the signature
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");

    if (digest !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Find the purchase entry using `razorpay_order_id`
    const purchase = await CoursePurchase.findOne({
      paymentId: razorpay_order_id,
    }).populate("courseId");

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase record not found",
      });
    }

    // Update the purchase status to `completed`
    purchase.status = "completed";
    purchase.paymentId = razorpay_payment_id; // Store the payment ID
    await purchase.save();

    // Make all lectures visible by setting `isPreviewFree` to true
    if (purchase.courseId && purchase.courseId.lectures.length > 0) {
      await Lecture.updateMany(
        { _id: { $in: purchase.courseId.lectures } },
        { $set: { isPreviewFree: true } }
      );
    }

    // Update user's enrolledCourses
    await User.findByIdAndUpdate(
      purchase.userId,
      { $addToSet: { enrolledCourses: purchase.courseId._id } },
      { new: true }
    );

    // Update course to add user ID to enrolledStudents
    await Course.findByIdAndUpdate(
      purchase.courseId._id,
      { $addToSet: { enrolledStudents: purchase.userId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("Error in verifyPayment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update purchase status",
      error: error.message,
    });
  }
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({ userId, courseId });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      course,
      purchased: !!purchased, // true if purchased, false otherwise
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to get course details",
      error: error.message,
    });
  }
};

export const getAllPurchasedCourse = async (req, res) => {
  try {
    const userId = req.id;
    const purchasedCourses = await CoursePurchase.find({
      userId,
      status: "completed",
    }).populate("courseId");

    console.log("purchased Courses", purchasedCourses);

    if (!purchasedCourses || purchasedCourses.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No purchased courses found",
        purchasedCourses: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Purchased courses found",
      purchasedCourses,
    });
  } catch (error) {
    console.error("Error in getAllPurchasedCourse:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get all purchased courses",
      error: error.message,
    });
  }
};
