import express from 'express';
import auth from '../../../middleware/auth';
import mongoose from 'mongoose';

// Schemas
import Lesson from '../schemas/LessonSchema';
import Teacher from '../schemas/TeacherSchema';

const router = express.Router();

// @route GET api/lessons/:id
// @desc Get lesson by lesson id
// @access Private
router.get('/:id', auth, function(req, res) {
    let lessonId = null;
    try {
        lessonId = mongoose.Types.ObjectId(req.params.id);
    } catch(e) {
        return res.status(400).json({ msg: 'Bad request!' });
    }

    Lesson.findById(lessonId, (err, lesson) => {
        if (err || (lesson == null)) return res.status(400).json({ msg: 'No lesson with given id!' });

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

// @route GET api/lessons
// @desc Get lessons
// @access Private
router.get('/', auth, function(req, res) {
    Lesson.find({}, (err, lessons) => {
        if (err || (lessons == null)) return res.status(400).json({ msg: 'Bad request!' });

        const lessonsFiltered = lessons.map(l => {
            return {
                id: l._id,
                title: l.title,
                description: l.description,
                content: l.content,
                imageUris: l.imageUris,
                videoUris: l.videoUris,
                price: l.price,
                authorId: l.author
            };
        });

        res.status(200).json({ lessons: lessonsFiltered });
    });
});

// @route DELETE api/lessons/:id
// @desc Delete lesson
// @access Private
router.delete('/:id', auth, function(req, res) {
    const teacherId = mongoose.Types.ObjectId(req.user.id);
    let lessonId = null;
    try {
        lessonId = mongoose.Types.ObjectId(req.params.id);
    } catch(e) {
        return res.status(400).json({ msg: 'Bad request!' });
    }

    Teacher.findById(teacherId, (err, teacher) => {
        if (err || (teacher == null)) return res.status(400).json({ msg: 'No teacher found with provided credentials' });

        Lesson.findOneAndDelete({ _id: lessonId, author: teacher._id }, (err, lesson) => {
            if (err || (lesson == null)) return res.status(400).json({ msg: 'No lesson found with provided credentials' });

            res.status(200).json({ msg: 'deleted', id: lesson._id });
        });
    });
});

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

// @route POST api/lessons/extended
// @desc Get extended lessons data for provided ids
// @access Private
router.post('/extended', auth, function(req, res) {
    const lessonsIds = req.body.lessonsIds;

    if (!lessonsIds)
        return res.status(400).json({ msg: 'Bad request!' });

    Teacher.find({}, (err, teachers) => {
        if (err || (teachers == null)) return res.status(400).json({ msg: 'No data found for provided credentials' });

        Lesson.find({}, (err, lessons) => {
            if (err || (lessons == null)) return res.status(400).json({ msg: 'No data found for provided credentials!'});

            const lessonsFiltered = lessons.filter(l => {
                return lessonsIds.includes(l._id.toString());
            });

            const lessonsMapped = lessonsFiltered.map(l => {
                const authorData = teachers.filter(t => {
                    return (t._id.toString() === l.author.toString());
                })[0];

                return(
                    {
                        id: l._id,
                        title: l.title,
                        description: l.description,
                        content: l.content,
                        imageUris: l.imageUris,
                        videoUris: l.videoUris,
                        price: l.price,
                        authorId: l.author,
                        authorSubject: authorData.subject,
                        authorName: authorData.name,
                        authorEmail: authorData.email
                    }
                );
            });

            res.status(200).json({ lessons: lessonsMapped });
        });
    });
});

// @route POST api/lessons
// @desc Add new lesson
// @access Private
router.post('/', auth, function(req, res) {
    const {
        title,
        description,
        content,
        price,
        videoUrls,
        imageUrls
    } = req.body;

    if (!title || !description || !content) {
        return res.status(400).json({ msg: 'Fields marked with asterisk are required!' });
    }

    const authorId = req.user.id;
    Teacher.findById(mongoose.Types.ObjectId(authorId), (err, teacher) => {
        if (err) return res.status(400).json({ msg: 'Only teachers can add lessons!' });

        let videos = undefined;
        if (videoUrls) {
            videos = videoUrls;
        }

        let images = undefined;
        if (imageUrls) {
            images = imageUrls;
        }

        const lesson = new Lesson({
            title,
            description,
            content,
            author: teacher._id,
            price,
            videoUris: videos,
            imageUris: images
        });

        lesson.save()
        .then(l => {
            res.status(201).json({
                id: l._id,
                title: l.title,
                description: l.description,
                content: l.content,
                imageUris: l.imageUris,
                videoUris: l.videoUris,
                price: l.price,
                authorId: l.author
            });
        })
        .catch(e => {
            res.status(400).json({ msg: 'Bad request!' });
        });
    });
});

export default router;