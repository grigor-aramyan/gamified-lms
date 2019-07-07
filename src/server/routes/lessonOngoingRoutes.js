import express from 'express';
import mongoose from 'mongoose';
import auth from '../../../middleware/auth';

// Schemas
import LessonOngoing from '../schemas/LessonOngoingSchema';

const router = express.Router();

// @route GET api/lesson_ongoings
// @desc Get lesson ongoings
// @access Private
router.get('/', auth, function(req, res) {
    res.json({ msg: 'done lesson ongoings' });
});

export default router;