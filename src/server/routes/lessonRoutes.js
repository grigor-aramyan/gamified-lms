import express from 'express';
import auth from '../../../middleware/auth';

// Schemas
import Lesson from '../schemas/LessonSchema';

const router = express.Router();

router.get('/', function(req, res) {
    res.json({ msg: 'Test res for lessons router' });
});

export default router;