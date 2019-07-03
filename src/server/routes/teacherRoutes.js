import express from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import bcrypt from 'bcryptjs';

// Schemas
import Teacher from '../schemas/TeacherSchema';

const router = express.Router();

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