import express from 'express';
import auth from '../../../middleware/auth';

// Schemas
import Course from '../schemas/CourseSchema';

const router = express.Router();

router.get('/', function(req, res) {
    res.json({ msg: 'Test route for courses!' });
});

export default router;