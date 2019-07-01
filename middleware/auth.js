import config from 'config';
import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
    const token = req.header('x-auth-token');

    if(!token) return res.status(401).json({ msg: 'No token, authorization denied!' });

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded;
        next();
    } catch(e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
}