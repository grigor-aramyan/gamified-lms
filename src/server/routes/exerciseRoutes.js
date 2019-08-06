import express from 'express';
import mongoose from 'mongoose';
import auth from '../../../middleware/auth';

const router = express.Router();

// @route GET api/exercises
// @desc Get exercises
// @access Private
router.get('/', function(req, res) {
    res.json({ msg: 'test message' });
});

export default router;