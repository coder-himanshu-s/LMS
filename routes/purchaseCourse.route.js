import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { purchaseCourse, verifyPayment, getAllPurchasedCourse, getCourseDetailWithPurchaseStatus } from "../controllers/coursePurchase.controller.js";

const router = express.Router();

router.route("/create-order").post(isAuthenticated, purchaseCourse);
router.route("/verify-payment").post(verifyPayment);
router.route("/course/:courseId/detail-with-status").get(isAuthenticated, getCourseDetailWithPurchaseStatus);
router.route("/").get(isAuthenticated, getAllPurchasedCourse);

export default router;