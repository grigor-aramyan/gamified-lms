import express from 'express';
import mongoose from 'mongoose';
import auth from '../../../middleware/auth';

// Schemas
import LessonOngoing from '../schemas/LessonOngoingSchema';
import Learner from '../schemas/LearnerSchema';
import Lesson from '../schemas/LessonSchema';

const router = express.Router();

// @route POST api/lesson_ongoings
// @desc Create lesson ongoing for logged in learner
// @access Private
router.post('/', auth, function(req, res) {
    const learnerId = mongoose.Types.ObjectId(req.user.id);

    let lessonId = null;
    try {
        lessonId = mongoose.Types.ObjectId(req.body.lessonId);
    } catch(e) {
        return res.status(400).json({ msg: 'No lesson found with provided credentials' });
    }

    Learner.findById(learnerId, (err, learner) => {
        if (err || (learner == null)) return res.status(400).json({ msg: 'No learner found with provided credentials' });

        Lesson.findById(lessonId, (err, lesson) => {
            if (err || (lesson == null)) return res.status(400).json({ msg: 'No lesson found with provided credentials' });

            const newLessonOngoing = new LessonOngoing({
                learnerId: learner._id,
                lessonId: lesson._id
            });

            newLessonOngoing.save()
                .then(lo => {
                    res.status(201).json({
                        lesson_ongoing: {
                            id: lo._id,
                            completed: lo.completed,
                            lessonId: lo.lessonId,
                            learnerId: lo.learnerId 
                        }
                    });
                });
        });
    });
});

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