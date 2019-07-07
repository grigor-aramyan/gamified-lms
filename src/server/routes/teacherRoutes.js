import express from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import auth from '../../../middleware/auth';

// Schemas
import Teacher from '../schemas/TeacherSchema';

const router = express.Router();

// @route GET api/teachers
// @desc Get teachers list
// @access Private
router.get('/', auth, function(req, res) {
    Teacher.find({}, (err, teachers) => {
        if (err || (teachers == null)) return res.status(400).json({ msg: 'Bad request' });

        const teachersFiltered = teachers.map(t => {
            return {
                id: t._id,
                name: t.name,
                email: t.email,
                subject: t.subject,
                registration_date: t.registration_date,
                lessons: t.lessons,
                courses: t.courses
            };
        });

        res.status(200).json({ teachers: teachersFiltered });
    });
});


// @route DELETE api/teachers
// @desc Delete teacher (self)
// @access Private
router.delete('/', auth, function(req, res) {
    const teacherId = mongoose.Types.ObjectId(req.user.id);

    Teacher.findByIdAndDelete(teacherId, (err, teacher) => {
        if (err || (teacher == null)) return res.status(400).json({ msg: 'No teacher found with provided credentials' });

        res.status(200).json({ msg: 'deleted', id: teacher._id });
    });
});

// @route PUT api/teachers
// @desc Update teacher data
// @access Private
router.put('/', auth, function(req, res) {
    const dataObject = req.body;
    const teacherId = mongoose.Types.ObjectId(req.user.id);

    Teacher.findById(teacherId, (err, teacher) => {
        if (err || (teacher == null)) return res.status(400).json({ msg: 'No teacher found with provided credentials' });

        Teacher.updateOne({ _id: teacher._id }, dataObject, (err, affected, resp) => {
            if (err) return res.status(500).json({ msg: 'Internal error. Try later, please!' });

            res.json({ msg: `success` });
        });
    });
});

// @route POST api/teachers
// @desc Register new teacher
// @access Public
router.post('/', function(req, res) {
    const { name, email, password, subject } = req.body;

    if (!name || !email || !password || !subject) {
        return res.status(400).json({ msg: 'Fields marked with asterisk are required!' });
    }

    Teacher.findOne({ email })
        .then(teacher => {
            if (teacher) return res.status(400).json({ msg: 'Teacher with this email already exists!' });

            const newTeacher = new Teacher({
                name,
                email,
                password,
                subject
            });

            bcrypt.genSalt(10, (err, salt) => {
                if (err) return res.status(500).json({ msg: 'Internal server error!' });

                bcrypt.hash(newTeacher.password, salt, (err, hash) => {
                    if (err) return res.status(500).json({ msg: 'Internal server error!' });

                    newTeacher.password = hash;
                    newTeacher.save()
                        .then(teacher => {
                            jwt.sign(
                                { id: teacher._id },
                                config.get('jwtSecret'),
                                {expiresIn: 3600 },
                                (err, token) => {
                                    if (err) return res.status(500).json({ msg: 'Internal server error!' });
                                    
                                    res.json({
                                        token,
                                        teacher: {
                                            id: teacher._id,
                                            name: teacher.name,
                                            email: teacher.email,
                                            subject: teacher.subject
                                        }
                                    });
                                }
                            );
                        });
                });
            });
        })
});

export default router;