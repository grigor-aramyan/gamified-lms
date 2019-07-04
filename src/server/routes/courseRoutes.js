import express from 'express';
import mongoose from 'mongoose';
import auth from '../../../middleware/auth';

// Schemas
import Course from '../schemas/CourseSchema';

const router = express.Router();

// @route POST api/courses
// @desc Add new course
// @access Private
router.post('/', auth, function(req, res) {
    const lessonsIds = req.body.lessons;
    const { title, description, author, price } = req.body;
    
    try {
        if (!lessonsIds || lessonsIds.length == 0) {
            return res.status(400).json({ msg: 'Course should contain at least one lesson!' });
        }
    } catch(e) {
        return res.status(400).json({ msg: 'Bad request' });
    }

    if (!title || !description || !author) {
        return res.status(400).json({ msg: 'Fields marked with asterisk are required!' });
    }

    const lessonsIdsFiltered = lessonsIds.filter(l => {
        //let objectId = null;
        try {
            mongoose.Types.ObjectId(l);
            return true;
        } catch(e) {
            return false;
        }
    }).map(l => { return mongoose.Types.ObjectId(l); });

    if (lessonsIdsFiltered.length == 0) {
        return res.status(400).json({ msg: 'Course should contain at least one lesson!' });
    }

    const course = new Course({
        lessons: lessonsIdsFiltered,
        title,
        description,
        author,
        price
    });

    course.save()
        .then(c => {
            res.json(JSON.stringify(c));
        })
        .catch(e => {
            console.log(e);
            res.status(400).json({ msg: 'Bad request!' });
        });
});

export default router;