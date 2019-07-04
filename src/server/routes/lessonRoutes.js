import express from 'express';
import auth from '../../../middleware/auth';
import mongoose from 'mongoose';

// Schemas
import Lesson from '../schemas/LessonSchema';
import Teacher from '../schemas/TeacherSchema';

const router = express.Router();

// @route POST api/lessons
// @desc Add new lesson
// @access Private
router.post('/', auth, function(req, res) {
    const { title, description, content, price } = req.body;

    if (!title || !description || !content) {
        return res.status(400).json({ msg: 'Fields marked with asterisk are required!' });
    }

    const authorId = req.user.id;
    Teacher.findById(mongoose.Types.ObjectId(authorId), (err, teacher) => {
        if (err) return res.status(400).json({ msg: 'Only teachers can add lessons!' });

        const lesson = new Lesson({
            title,
            description,
            content,
            author: teacher._id,
            price
        });

        lesson.save()
        .then(l => {
            res.status(201).json(JSON.stringify(l));
        })
        .catch(e => {
            res.status(400).json({ msg: 'Bad request!' });
        });
    });
});

export default router;