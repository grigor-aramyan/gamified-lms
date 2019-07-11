import express from 'express';
import mongoose from 'mongoose';
import auth from '../../../middleware/auth';

// Schemas
import CourseOngoing from '../schemas/CourseOngoingSchema';
import Learner from '../schemas/LearnerSchema';

const router = express.Router();

// @route GET api/course_ongoings
// @desc Get course ongoings of logged in learner
// @access Private
router.get('/', auth, function(req, res) {
    const learnerId = mongoose.Types.ObjectId(req.user.id);

    Learner.findById(learnerId, (err, learner) => {
        if (err || (learner == null)) return res.status(400).json({ msg: 'No learner found with provided credentials' });

        CourseOngoing.find({ learnerId: learner._id }, (err, courseOngoings) => {
            if (err) return res.status(400).json({ msg: 'Bad request!' });

            const courseOngoingsFiltered = courseOngoings.map(c => {
                return {
                    id: c._id,
                    completed: c.completed,
                    courseId: c.courseId,
                    completionPoints: c.completionPoints
                };
            });

            res.status(200).json({ course_ongoings: courseOngoingsFiltered });
        });
    });
});

export default router;