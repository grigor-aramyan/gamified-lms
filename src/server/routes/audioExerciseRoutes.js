import express from 'express';
import mongoose from 'mongoose';
import auth from '../../../middleware/auth';

// Schemas
import AudioExercise from '../schemas/AudioExerciseSchema';
import Lesson from '../schemas/LessonSchema';

const router = express.Router();

// @route POST api/exercises/audioQuestion/updateLessonAqBase
// @desc Delete exercises with provided ids and create new exercises from provided json objects
// @access Private
router.post('/audioQuestion/updateLessonAqBase', auth, function(req, res) {
    const teacherId = mongoose.Types.ObjectId(req.user.id);
    
    const {
        deletedIds,
        exercises
    } = req.body;

    if (!deletedIds || !Array.isArray(deletedIds)) return res.status(400).json({ msg: 'Bad request' });

    if (!exercises || !Array.isArray(exercises)) return res.status(400).json({ msg: 'Bad request!' });

    if ((deletedIds.length <= 0) && (exercises.length <= 0))
        return res.status(400).json({ msg: 'No data to work with!' });

    const exercisesWithEmptyAnswers = exercises.filter(e => {
        const answers = e.answerImages;
        if (!Array.isArray(answers) || (answers.length < 2)) {
            return true;
        } else {
            return false;
        }
    });

    if (exercisesWithEmptyAnswers.length != 0)
        return res.status(400).json({ msg: 'All exercises should have at least 2 answers!' });

    const exercisesWithWrongRightAnswerIndex = exercises.filter(e => {
        const answers = e.answerImages;
        const rightAnswerIndex = e.rightAnswerIndex;

        if ((rightAnswerIndex > (answers.length - 1)) || (rightAnswerIndex < 0)) {
            return true;
        } else {
            return false;
        }
    });

    if (exercisesWithWrongRightAnswerIndex.length != 0)
        return res.status(400).json({ msg: 'Some exercises have inappropriate right answers!' });

    const deletedExercisesWithBustedIds = deletedIds.filter(de => {
        try {
            mongoose.Types.ObjectId(de);
            return false;
        } catch(e) {
            return true;
        }
    });
    if (deletedExercisesWithBustedIds.length != 0)
        return res.status(400).json({ msg: 'All exercises for delete should have valid ids!' });
    
    let tmpLessonId = null;
    const exercisesWithBustedLessonId = exercises.filter(e => {
        const lessonId = e.lessonId;
        
        try {
            mongoose.Types.ObjectId(lessonId);

            if (!tmpLessonId)
                tmpLessonId = e.lessonId;

            return false;
        } catch(e) {
            return true;
        }
    });

    if (exercisesWithBustedLessonId.length != 0)
        return res.status(400).json({ msg: 'All exercises should have valid lesson ids!' });

    if (tmpLessonId) {
        Lesson.findById(tmpLessonId, (err, l) => {
            if (err || (l == null)) return res.status(400).json({ msg: 'No lesson found for provided exercises!' });
    
            if (l.author.toString() !== teacherId.toString())
                return res.status(400).json({ msg: 'Lesson exercises can be modified by lessons authors only!' });
    
            const exercisesToDelete = deletedIds.map(i => {
                return(mongoose.Types.ObjectId(i));
            });
    
            AudioExercise.deleteMany({ _id: { $in: exercisesToDelete } }, (err) => {
                if (err) return res.status(500).json({ msg: 'Something weird on our side! Contact with us, please' });
    
                const exercisesMapped = exercises.map(e => {
                    return({
                        lessonId: mongoose.Types.ObjectId(e.lessonId),
                        audioQuestion: e.audioQuestion,
                        answerImages: e.answerImages,
                        rightAnswerIndex: e.rightAnswerIndex
                    });
                });
            
                AudioExercise.collection.insertMany(exercisesMapped, (err, satExercises) => {
                    if (err || (satExercises == null))
                        return res.status(500).json({ msg: 'Some weird error! Contact with us, please!' });
            
                    AudioExercise.find({ lessonId: tmpLessonId }, (err2, exercises2) => {
                        if (err2 || (exercises2 == null)) return res.status(400).json({ msg: 'No exercises found for this lesson!' });
                        
                        const exercisesMapped2 = exercises2.map(e => {
                            return({
                                id: e._id.toString(),
                                lessonId: e.lessonId,
                                audioQuestion: e.audioQuestion,
                                answerImages: e.answerImages,
                                rightAnswerIndex: e.rightAnswerIndex
                            });
                        });
                
                        res.status(200).json({ exercises: exercisesMapped2 });
                    });
                });
            });
        });
    } else if (deletedIds.length > 0) {
        try {
            const tmpQuestionId = mongoose.Types.ObjectId(deletedIds[0]);

            AudioExercise.findById(tmpQuestionId.toString(), (err, s) => {
                if (err || (s == null)) return res.status(400).json({ msg: 'No exercise found with provided id!' });

                try {
                    const tmpLessId = mongoose.Types.ObjectId(s.lessonId);

                    Lesson.findById(tmpLessId.toString(), (err, l) => {
                        if (err || (l == null)) return res.status(400).json({ msg: 'No lesson found for provided exercises!' });
                
                        if (l.author.toString() !== teacherId.toString())
                            return res.status(400).json({ msg: 'Lesson exercises can be modified by lessons authors only!' });
                
                        const exercisesToDelete = deletedIds.map(i => {
                            return(mongoose.Types.ObjectId(i));
                        });
                
                        AudioExercise.deleteMany({ _id: { $in: exercisesToDelete } }, (err) => {
                            if (err) return res.status(500).json({ msg: 'Something weird on our side! Contact with us, please' });
                
                            AudioExercise.find({ lessonId: tmpLessId }, (err2, exercises2) => {
                                if (err2 || (exercises2 == null)) return res.status(400).json({ msg: 'No exercises found for this lesson!' });
                                
                                const exercisesMapped2 = exercises2.map(e => {
                                    return({
                                        id: e._id.toString(),
                                        lessonId: e.lessonId,
                                        audioQuestion: e.audioQuestion,
                                        answerImages: e.answerImages,
                                        rightAnswerIndex: e.rightAnswerIndex
                                    });
                                });
                        
                                res.status(200).json({ exercises: exercisesMapped2 });
                            });
                        });
                    });
                } catch(e) {
                    return res.status(400).json({ msg: 'No lesson found for provided exercises!' });
                }
            });
        } catch(e) {
            return res.status(400).json({ msg: 'Provide valid data, please!' });
        }
    } else {
        res.status(400).json({ msg: 'No valid data to work with!' });
    }
});

// @route POST api/exercises/audioQuestion
// @desc Create exercises from provided json objects
// @access Private
router.post('/audioQuestion', auth, function(req, res) {
    const exercises = req.body.exercises;
    
    if (!exercises || (exercises.length == 0)) return res.status(400).json({ msg: 'Bad request!' });

    const exercisesWithEmptyAnswers = exercises.filter(e => {
        const answers = e.answerImages;
        if (!Array.isArray(answers) || (answers.length < 2)) {
            return true;
        } else {
            return false;
        }
    });

    if (exercisesWithEmptyAnswers.length != 0)
        return res.status(400).json({ msg: 'All exercises should have at least 2 answers!' });

    const exercisesWithWrongRightAnswerIndex = exercises.filter(e => {
        const answers = e.answerImages;
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
            audioQuestion: e.audioQuestion,
            answerImages: e.answerImages,
            rightAnswerIndex: e.rightAnswerIndex
        });
    });

    AudioExercise.collection.insertMany(exercisesMapped, (err, satExercises) => {
        if (err || (satExercises == null))
            return res.status(400).json({ msg: 'Some weird error! Contact with us, please!' });

        const exercisesDataFiltered = satExercises.ops.map(e => {
            return({
                id: e._id.toString(),
                lessonId: e.lessonId,
                audioQuestion: e.audioQuestion,
                answerImages: e.answerImages,
                rightAnswerIndex: e.rightAnswerIndex
            });
        });

        res.status(201).json({ exercises: exercisesDataFiltered });
    });
});

// @route GET api/exercises/audioQuestion/:id
// @desc Get exercises of lesson with given id
// @access Private
router.get('/audioQuestion/:id', auth, function(req, res) {
    let lessonId = null;
    try {
        lessonId = mongoose.Types.ObjectId(req.params.id);
    } catch(e) {
        return res.status(400).json({ msg: 'Bad request' });
    }
    
    AudioExercise.find({ lessonId: lessonId }, (err, exercises) => {
        if (err || (exercises == null)) return res.status(400).json({ msg: 'No exercises found for this lesson!' });
        
        const exercisesMapped = exercises.map(e => {
            return({
                id: e._id.toString(),
                lessonId: e.lessonId,
                audioQuestion: e.audioQuestion,
                answerImages: e.answerImages,
                rightAnswerIndex: e.rightAnswerIndex
            });
        });

        res.status(200).json({ exercises: exercisesMapped });
    });
});

export default router;