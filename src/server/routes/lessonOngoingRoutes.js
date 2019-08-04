import express from 'express';
import mongoose from 'mongoose';
import auth from '../../../middleware/auth';

// Schemas
import LessonOngoing from '../schemas/LessonOngoingSchema';
import Learner from '../schemas/LearnerSchema';
import Teacher from '../schemas/TeacherSchema';
import Lesson from '../schemas/LessonSchema';

const router = express.Router();

// @route UPDATE api/lesson_ongoings/:id
// @desc Update lesson ongoing of learner by logged in teacher
// @access Private
router.put('/:id', auth, function(req, res) {
    const teacherId = mongoose.Types.ObjectId(req.user.id);

    const dataObject = req.body;

    let lessonOngoingId = null;
    try {
        lessonOngoingId = mongoose.Types.ObjectId(req.params.id);
    } catch(e) {
        return res.status(400).json({ msg: 'No data found to update!' });
    }

    Teacher.findById(teacherId, (err, teacher) => {
        if (err || (teacher == null)) return res.status(400).json({ msg: 'No teacher found with provided credentials' });

        LessonOngoing.findById(lessonOngoingId, (err, lo) => {
            if (err || (lo == null)) return res.status(400).json({ msg: 'No data found to update!' });

            Lesson.findById(lo.lessonId, (err, lesson) => {
                if (err || (lesson == null)) return res.status(400).json({ msg: 'Bad request!' });

                if (teacher._id.toString() === lesson.author.toString()) {

                    LessonOngoing.updateOne({ _id: lessonOngoingId }, dataObject, (err, affected, resp) => {
                        if (err) return res.status(500).json({ msg: 'Internal error! Try later or contact with us, please.' });

                        return res.status(200).json({ msg: 'success' });
                    });

                } else {
                    return res.status(400).json({ msg: 'Only author of this lesson can modify it!' });
                }
            });
        });
    });
});

// @route DELETE api/lesson_ongoings/:id
// @desc Delete lesson ongoing of logged in learner
// @access Private
router.delete('/:id', auth, function(req, res) {
    const learnerId = mongoose.Types.ObjectId(req.user.id);

    let lessonOngoingId = null;
    try {
        lessonOngoingId = mongoose.Types.ObjectId(req.params.id);
    } catch(e) {
        return res.status(400).json({ msg: 'No data found for provided credentials!' });
    }

    Learner.findById(learnerId, (err, learner) => {
        if (err || (learner == null)) return res.status(400).json({ msg: 'No learner found with provided credentials' });

        LessonOngoing.findOneAndDelete({ _id: lessonOngoingId, learnerId: learner._id }, (err, lo) => {
            if (err || (lo == null)) return res.status(400).json({ msg: 'No data found to delete' });

            res.status(200).json({ msg: 'deleted', id: lo._id });
        });

    });
});

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

// @route GET api/lesson_ongoings/lesson/:id
// @desc Get lesson by lesson ongoing id
// @access Private
router.get('/lesson/:id', auth, function(req, res) {
    const learnerId = mongoose.Types.ObjectId(req.user.id);

    let lessonOngoingId = null;
    try {
        lessonOngoingId = mongoose.Types.ObjectId(req.params.id);
    } catch(e) {
        return res.status(400).json({ msg: 'No lesson found with provided credentials' });
    }

    LessonOngoing.findOne({ _id: lessonOngoingId, learnerId: learnerId }, (err, lessonOngoing) => {
        if (err || (lessonOngoing == null)) return res.status(400).json({ msg: 'No data found with provided credentials' });

        Lesson.findById(lessonOngoing.lessonId, (err, lesson) => {
            if (err || (lesson == null)) return res.status(400).json({ msg: 'No lesson found with provided credentials!' });

            res.status(200).json({
                id: lesson._id,
                title: lesson.title,
                description: lesson.description,
                content: lesson.content,
                imageUris: lesson.imageUris,
                videoUris: lesson.videoUris,
                price: lesson.price,
                authorId: lesson.author
            });
        });
    });
});

export default router;