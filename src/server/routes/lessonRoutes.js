import express from 'express';
import auth from '../../../middleware/auth';
import mongoose from 'mongoose';

// Schemas
import Lesson from '../schemas/LessonSchema';
import Teacher from '../schemas/TeacherSchema';

const router = express.Router();

// @route PUT api/lessons/:id
// @desc Update lesson data
// @access Private
router.put('/:id', auth, function(req, res) {
    const dataObject = req.body;
    const teacherId = mongoose.Types.ObjectId(req.user.id);
    let lessonId = null;

    try {
        lessonId = mongoose.Types.ObjectId(req.params.id);
    } catch(e) {
        return res.status(400).json({ msg: 'Bad request!' });
    }

    Teacher.findById(teacherId, (err, teacher) => {
        if (err || (teacher == null)) return res.status(400).json({ msg: 'No teacher found with provided credentials' });

        Lesson.findOne({ _id: lessonId, author: teacherId }, (err, lesson) => {
            if (err || (lesson == null)) return res.status(400).json({ msg: 'No lesson found with provided credentials' });
            
            Lesson.updateOne({ _id: lesson._id }, dataObject, (err, affected, resp) => {
                if (err) return res.status(500).json({ msg: 'Internal error. Try later, please' });

                res.status(200).json({ msg: 'success' });
            });
        });
    });
});

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