import express from 'express';
import mongoose from 'mongoose';
import auth from '../../../middleware/auth';

// Schemas
import Course from '../schemas/CourseSchema';
import Teacher from '../schemas/TeacherSchema';

const router = express.Router();

// @route GET api/courses
// @desc Get courses
// @access Private
router.get('/', auth, function(req, res) {
    Course.find({}, (err, courses) => {
        if (err || (courses == null)) return res.status(400).json({ msg: 'Bad request!' });

        const coursesFiltered = courses.map(c => {
            return {
                id: c._id,
                title: c.title,
                description: c.description,
                authorId: c.author,
                lessonsId: c.lessons,
                price: c.price
            };
        });

        res.status(200).json({ courses: coursesFiltered });
    });
});

// @route DELETE api/courses/:id
// @desc Delete course
// @access Private
router.delete('/:id', auth, function(req, res) {
    const teacherId = mongoose.Types.ObjectId(req.user.id);
    let courseId = null;
    try {
        courseId = mongoose.Types.ObjectId(req.params.id);
    } catch(e) {
        return res.status(400).json({ msg: 'Bad request!' });
    }

    Teacher.findById(teacherId, (err, teacher) => {
        if (err || (teacher == null)) return res.status(400).json({ msg: 'No teacher found with provided credentials' });

        Course.findOneAndDelete({ _id: courseId, author: teacher._id }, (err, course) => {
            if (err || (course == null)) return res.status(400).json({ msg: 'No course found with provided credentials' });

            res.status(200).json({ msg: 'deleted', id: course._id });
        });
    });
});

// @route PUT api/courses/:id
// @desc Update course data
// @access Private
router.put('/:id', auth, function(req, res) {
    const teacherId = mongoose.Types.ObjectId(req.user.id);
    const dataObject = req.body;

    let courseId = null;
    try {
        courseId = mongoose.Types.ObjectId(req.params.id);
    } catch(e) {
        return res.status(400).json({ msg: 'Bad request!' });
    }
    
    try {
        if (dataObject.lessons) {
            if (Object.prototype.toString.call(dataObject.lessons) === '[object Array]') {
                if (dataObject.lessons.length == 0) {
                    return res.status(400).json({ msg: 'Course can\'t contain 0 lessons' });
                }
            } else {
                return res.status(400).json({ msg: 'Bad request' });
            }
        }
    } catch(e) {
        return res.status(400).json({ msg: 'Bad request' });
    }

    Teacher.findById(teacherId, (err, teacher) => {
        if (err || (teacher == null)) return res.status(400).json({ msg: 'No teacher found with provided credentials' });

        Course.findOne({ _id: courseId, author: teacher._id }, (err, course) => {
            if (err || (course == null)) return res.status(400).json({ msg: 'No course found with provided credentials' });

            if (dataObject.lessons) {
                const lessonsObjectIds = dataObject.lessons.filter(l => {
                    try {
                        mongoose.Types.ObjectId(l);
                        return true;
                    } catch(e) {
                        return false;
                    }
                }).map(l => { return mongoose.Types.ObjectId(l); });

                if (lessonsObjectIds.length == 0) return res.status(400).json({ msg: 'Course can\t contain 0 lessons' });

                dataObject.lessons = lessonsObjectIds;
                Course.updateOne({ _id: course._id }, dataObject, (err, affected, resp) => {
                    if (err) return res.status(500).json({ msg: 'Internal error. Try later, please!' });
    
                    res.status(200).json({ msg: 'success' });
                });
            } else {
                Course.updateOne({ _id: course._id }, dataObject, (err, affected, resp) => {
                    if (err) return res.status(500).json({ msg: 'Internal error. Try later, please!' });
    
                    res.status(200).json({ msg: 'success' });
                });
            }
        });
    });
});

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