import express from 'express';
import mongoose from 'mongoose';
import auth from '../../../middleware/auth';

// Schemas
import SingleAnswerTestExercise from '../schemas/SingleAnswerTestExercise';

const router = express.Router();

// @route GET api/exercises/singleAnswerTestQuestion/:id
// @desc Get exercises of lesson with given id
// @access Private
router.get('/singleAnswerTestQuestion/:id', auth, function(req, res) {
    let lessonId = null;
    try {
        lessonId = mongoose.Types.ObjectId(req.params.id);
    } catch(e) {
        return res.status(400).json({ msg: 'Bad request' });
    }

    SingleAnswerTestExercise.find({ lessonId: lessonId }, (err, exercises) => {
        if (err || (exercises == null)) return res.status(400).json({ msg: 'No exercises found for this lesson!' });

        const exercisesMapped = exercises.map(e => {
            return({
                lessonId: e.lessonId,
                question: e.question,
                answers: e.answers,
                rightAnswerIndex: e.rightAnswerIndex
            });
        });

        res.status(200).json({ exercises: exercisesMapped });
    });
});

export default router;