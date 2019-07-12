import express from 'express';
import mongoose from 'mongoose';
import auth from '../../../middleware/auth';

// Schemas
import CourseOngoing from '../schemas/CourseOngoingSchema';
import Learner from '../schemas/LearnerSchema';
import Course from '../schemas/CourseSchema';

const router = express.Router();

// @route DELETE api/course_ongoings/:id
// @desc Delete course ongoing of logged in learner
// @access Private
router.delete('/:id', auth, function(req, res) {
    const learnerId = mongoose.Types.ObjectId(req.user.id);

    let courseOngoingId = null;
    try {
        courseOngoingId = mongoose.Types.ObjectId(req.params.id);
    } catch(e) {
        return res.status(400).json({ msg: 'No data found to delete!' });
    }

    Learner.findById(learnerId, (err, learner) => {
        if (err || (learner == null)) return res.status(400).json({ msg: 'No learner found with provided credentials' });

        CourseOngoing.findOneAndDelete({ _id: courseOngoingId, learnerId: learner._id }, (err, co) => {
            if (err || (co == null)) return res.status(400).json({ msg: 'No data found to delete!' });

            res.status(200).json({ msg: 'deleted', id: co._id });
        });
    });
});

// @route POST api/course_ongoings
// @desc Create course ongoing for logged in learner
// @access Private
router.post('/', auth, function(req, res) {
    const learnerId = mongoose.Types.ObjectId(req.user.id);

    let courseId = null;
    try {
        courseId = mongoose.Types.ObjectId(req.body.courseId);
    } catch(e) {
        return res.status(400).json({ msg: 'No course found with provided credentials!' });
    }

    Learner.findById(learnerId, (err, learner) => {
        if (err || (learner == null)) return res.status(400).json({ msg: 'No learner found with provided credentials' });

        Course.findById(courseId, (err, course) => {
            if (err || (course == null)) return res.status(400).json({ msg: 'No course found with provided credentials!' });

            const courseOngoing = new CourseOngoing({
                learnerId: learner._id,
                courseId: course._id
            });

            courseOngoing.save()
                .then(co => {
                    res.status(201).json({
                        course_ongoing: {
                            id: co._id,
                            completed: co.completed,
                            courseId: co.courseId,
                            learnerId: co.learnerId        
                        }
                    });
                });
        });
    });
});

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