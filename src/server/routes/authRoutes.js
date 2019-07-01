import express from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import bcrypt from 'bcryptjs';

import auth from '../../../middleware/auth';

// Schemas
import User from '../schemas/UserSchema';

const router = express.Router();

// @route POST api/auth
// @desc Login user
// @access Public
router.post('/', function(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Email and Password required' });
    }

    User.findOne({ email })
        .then(user => {
            if (!user) return res.status(400).json({ msg: 'User does not exist' });

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

                    jwt.sign(
                        { id: user._id },
                        config.get('jwtSecret'),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) return res.status(500).json({ msg: 'Something weird in our side with auth' });

                            res.json({
                                token,
                                user: {
                                    id: user._id,
                                    name: user.name,
                                    email: user.email
                                }
                            });
                        }
                    );
                });
        });
});

// @route GET api/auth/user
// @desc Get user data
// @access Private
router.get('/user', auth, function(req, res) {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json({
            id: user._id,
            name: user.name,
            email: user.email
        }));
});

export default router;