import express from 'express';

const router = express.Router();

router.get('/', function(req, res) {
    res.json({ msg: 'test response' });
});

export default router;