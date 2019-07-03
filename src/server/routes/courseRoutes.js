import express from 'express';
import mongoose from 'mongoose';
import auth from '../../../middleware/auth';

// Schemas
import Course from '../schemas/CourseSchema';
import Lesson from '../schemas/LessonSchema';

const router = express.Router();

// @route POST api/courses
// @desc Register new course
// @access Private

router.post('/', auth, function(req, res) {
    const lessonsIds = req.body.lessons;
    
    try {
        if (lessonsIds.length == 0) {
            return res.status(400).json({ msg: 'Course should contain at least one lesson!' });
        }
    } catch(e) {
        return res.status(400).json({ msg: 'Bad request' });
    }

    const lessons = lessonsIds.filter(l => {
        Lesson.findById(mongoose.Types.ObjectId(l), (err, lesson) => {
            if (err) return false;

            if (lesson == null || lesson == undefined) return false;

            return true;
        });
    }).map(l => {
        Lesson.findById(mongoose.Types.ObjectId(l), (err, lesson) => {
            return lesson;
        });
    });

    if (lessons.length == 0) {
        return res.status(400).json({ msg: 'Course should contain at least one lesson!' });
    }

    const course = new Course({
        lessons
    });

    course.save()
        .then(c => {
            res.json(JSON.stringify(c));
        })
        .catch(e => {
            res.status(400).json({ msg: 'Bad request!' });
        });
});

router.get('/', function(req, res) {
    res.json({ msg: 'Test route for courses!' });
});

export default router;