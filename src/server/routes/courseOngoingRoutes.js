import express from 'express';
import mongoose from 'mongoose';
import auth from '../../../middleware/auth';

// Schemas
import CourseOngoing from '../schemas/CourseOngoingSchema';

const router = express.Router();

// @route GET api/course_ongoings
// @desc Get course ongoings
// @access Private
router.get('/', auth, function(req, res) {
    res.json({ msg: 'done course ongoings' });
});

export default router;