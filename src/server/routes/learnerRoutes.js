import express from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import bcrypt from 'bcryptjs';

// Schemas
import Learner from '../schemas/LearnerSchema';

const router = express.Router();

// @route POST api/learners
// @desc Register new learner
// @access Public
router.post('/', function(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Fields marked with asterisk are required!' });
    }

    Learner.findOne({ email })
        .then(learner => {
            if (learner) return res.status(400).json({ msg: 'Learner with this email already exists!' });

            const newLearner = new Learner({
                name,
                email,
                password
            });

            bcrypt.genSalt(10, (err, salt) => {
                if (err) return res.status(500).json({ msg: 'Internal server error!' });

                bcrypt.hash(newLearner.password, salt, (err, hash) => {
                    if (err) return res.status(500).json({ msg: 'Internal server error!' });

                    newLearner.password = hash;
                    newLearner.save()
                        .then(learner => {
                            jwt.sign(
                                { id: learner._id },
                                config.get('jwtSecret'),
                                { expiresIn: 3600 },
                                (err, token) => {
                                    if (err) return res.status(500).json({ msg: 'Internal server error!' });

                                    res.json({
                                        token,
                                        learner: {
                                            id: learner._id,
                                            name: learner.name,
                                            email: learner.email,
                                            points: learner.points
                                        }
                                    });
                                }
                            );
                        });
                });
            });
        });
});

export default router;