import express from 'express';
import mongoose from 'mongoose';
import auth from '../../../middleware/auth';

// Schemas
import LessonOngoing from '../schemas/LessonOngoingSchema';
import Learner from '../schemas/LearnerSchema';

const router = express.Router();

// @route GET api/lesson_ongoings
// @desc Get lesson ongoings of logged in learner
// @access Private
router.get('/', auth, function(req, res) {
    const learnerId = mongoose.Types.ObjectId(req.user.id);

    Learner.findById(learnerId, (err, learner) => {
        if (err || (learner == null)) return res.status(400).json({ msg: 'No learner found with provided credentials' });

        LessonOngoing.find({ learnerId: learner._id }, (err, lessonOngoings) => {
            if (err) return res.status(400).json({ msg: 'Bad request!' });

            const lessonOngoingsFiltered = lessonOngoings.map(l => {
                return {
                    id: l._id,
                    completed: l.completed,
                    lessonId: l.lessonId,
                    completionPoint: l.completionPoint
                };
            });

            res.status(200).json({ lesson_ongoings: lessonOngoingsFiltered });
        });
    });
});

export default router;