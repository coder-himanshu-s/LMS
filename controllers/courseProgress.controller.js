import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/course.model.js";

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // step-1 fetch the user course progress
    let courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    }).populate("courseId");

    const courseDetails = await Course.findById(courseId).populate("lectures");

    if (!courseDetails) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Step-2 If no progress found, return course details with an empty progress
    if (!courseProgress) {
      const totalLectures = courseDetails.lectures.length || 0;
      return res.status(200).json({
        data: {
          courseDetails,
          progress: [],
          completed: false,
          totalLectures,
          completedCount: 0,
          progressPercentage: 0,
        },
      });
    }

    // compute completed count and percentage
    const totalLectures = courseDetails.lectures.length || 0;
    const completedCount = courseProgress.lectureProgress.filter(
      (lp) => lp.viewed
    ).length;
    const progressPercentage = totalLectures
      ? Math.round((completedCount / totalLectures) * 100)
      : 0;

    // Step-3 Return the user's course progress along with course details
    return res.status(200).json({
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
        totalLectures,
        completedCount,
        progressPercentage,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;

    // fetch or create course progress
    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      // If no progress exist, create a new record
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
      });
    }
    // Make progress cumulative: when a lecture is viewed, mark all previous
    // lectures (in course order) as viewed as well.
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Find index of the lecture in course.lectures
    const lectureIndexInCourse = course.lectures.findIndex(
      (lec) => String(lec._id) === String(lectureId)
    );

    // If not found, just mark the single lecture
    if (lectureIndexInCourse === -1) {
      const existing = courseProgress.lectureProgress.find(
        (lp) => lp.lectureId === lectureId
      );
      if (existing) existing.viewed = true;
      else courseProgress.lectureProgress.push({ lectureId, viewed: true });
    } else {
      // ensure lectureProgress has entries for all lectures up to this index
      for (let i = 0; i <= lectureIndexInCourse; i++) {
        const lecId = String(course.lectures[i]._id);
        const existing = courseProgress.lectureProgress.find(
          (lp) => String(lp.lectureId) === lecId
        );
        if (existing) {
          existing.viewed = true;
        } else {
          courseProgress.lectureProgress.push({ lectureId: lecId, viewed: true });
        }
      }
    }

    // if all lecture is complete
    const lectureProgressLength = course.lectures.filter((l) =>
      courseProgress.lectureProgress.some((lp) => String(lp.lectureId) === String(l._id) && lp.viewed)
    ).length;

    if (course.lectures.length === lectureProgressLength) courseProgress.completed = true;

    await courseProgress.save();

    return res.status(200).json({
      message: "Lecture progress updated successfully.",
    });
  } catch (error) {
    console.log(error);
  }
};

export const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress)
      return res.status(404).json({ message: "Course progress not found" });
    // Ensure we mark progress for ALL lectures in the course
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) return res.status(404).json({ message: "Course not found" });

    const newLectureProgress = course.lectures.map((lec) => ({
      lectureId: String(lec._id),
      viewed: true,
    }));

    courseProgress.lectureProgress = newLectureProgress;
    courseProgress.completed = true;
    await courseProgress.save();
    return res.status(200).json({ message: "Course marked as completed." });
  } catch (error) {
    console.log(error);
  }
};

export const markAsInCompleted = async (req, res) => {
    try {
      const { courseId } = req.params;
      const userId = req.id;
  
      const courseProgress = await CourseProgress.findOne({ courseId, userId });
      if (!courseProgress)
        return res.status(404).json({ message: "Course progress not found" });
      // Ensure we reset progress for ALL lectures in the course
      const course = await Course.findById(courseId).populate("lectures");
      if (!course) return res.status(404).json({ message: "Course not found" });

      const newLectureProgress = course.lectures.map((lec) => ({
        lectureId: String(lec._id),
        viewed: false,
      }));

      courseProgress.lectureProgress = newLectureProgress;
      courseProgress.completed = false;
      await courseProgress.save();
      return res.status(200).json({ message: "Course marked as incompleted." });
    } catch (error) {
      console.log(error);
    }
  };
