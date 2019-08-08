import express from 'express';
import mongoose from 'mongoose';
import auth from '../../../middleware/auth';

// Schemas
import SingleAnswerTestExercise from '../schemas/SingleAnswerTestExerciseSchema';

const router = express.Router();

// @route POST api/exercises/singleAnswerTestQuestion
// @desc Create exercises from provided json objects
// @access Private
router.post('/singleAnswerTestQuestion', auth, function(req, res) {
    const exercises = req.body.exercises;
    
    if (!exercises || (exercises.length == 0)) return res.status(400).json({ msg: 'Bad request!' });

    const exercisesWithEmptyAnswers = exercises.filter(e => {
        const answers = e.answers;
        if (!Array.isArray(answers) || (answers.length < 2)) {
            return true;
        } else {
            return false;
        }
    });

    if (exercisesWithEmptyAnswers.length != 0)
        return res.status(400).json({ msg: 'All exercises should have at least 2 answers!' });

    const exercisesWithWrongRightAnswerIndex = exercises.filter(e => {
        const answers = e.answers;
        const rightAnswerIndex = e.rightAnswerIndex;

        if ((rightAnswerIndex > (answers.length - 1)) || (rightAnswerIndex < 0)) {
            return true;
        } else {
            return false;
        }
    });

    if (exercisesWithWrongRightAnswerIndex.length != 0)
        return res.status(400).json({ msg: 'Some exercises have inappropriate right answers!' });

    const exercisesWithBustedLessonId = exercises.filter(e => {
        const lessonId = e.lessonId;
        try {
            mongoose.Types.ObjectId(lessonId);
            return false;
        } catch(e) {
            return true;
        }
    });

    if (exercisesWithBustedLessonId.length != 0)
        return res.status(400).json({ msg: 'All exercises should have valid lesson ids!' });

    const exercisesMapped = exercises.map(e => {
        return({
            lessonId: mongoose.Types.ObjectId(e.lessonId),
            question: e.question,
            answers: e.answers,
            rightAnswerIndex: e.rightAnswerIndex
        });
    });

    SingleAnswerTestExercise.collection.insertMany(exercisesMapped, (err, satExercises) => {
        if (err || (satExercises == null))
            return res.status(400).json({ msg: 'Some weird error! Contact with us, please!' });

        const exercisesDataFiltered = satExercises.ops.map(e => {
            return({
                lessonId: e.lessonId,
                question: e.question,
                answers: e.answers,
                rightAnswerIndex: e.rightAnswerIndex
            });
        });

        res.status(201).json({ exercises: exercisesDataFiltered });
    });
});

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