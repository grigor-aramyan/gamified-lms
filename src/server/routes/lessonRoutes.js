import express from 'express';
import auth from '../../../middleware/auth';

// Schemas
import Lesson from '../schemas/LessonSchema';

const router = express.Router();

// @route POST api/lessons
// @desc Add new lesson
// @access Private
router.post('/', auth, function(req, res) {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ msg: 'Fields marked with asterisk are required!' });
    }

    const lesson = new Lesson({
        title
    });

    lesson.save()
        .then(l => {
            res.status(201).json(JSON.stringify(l));
        })
        .catch(e => {
            res.status(400).json({ msg: 'Bad request!' });
        });
});

router.get('/', function(req, res) {
    res.json({ msg: 'Test res for lessons router' });
});

export default router;