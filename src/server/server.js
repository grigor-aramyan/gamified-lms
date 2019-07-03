import express from 'express';
import mongoose from 'mongoose';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import config from 'config';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import learnerRoutes from './routes/learnerRoutes';
import teacherRoutes from './routes/teacherRoutes';
import lessonRoutes from './routes/lessonRoutes';
import courseRoutes from './routes/courseRoutes';

import App from '../components/App';

const PORT = 4242;

const server = express();

server.use(express.json());
server.use(express.static('dist'));

// Routes
server.use('/api/users', userRoutes);
server.use('/api/auth', authRoutes);
server.use('/api/learners', learnerRoutes);
server.use('/api/teachers', teacherRoutes);
server.use('/api/lessons', lessonRoutes);
server.use('/api/courses', courseRoutes);


server.get('/*', (req, res) => {
    const initialMarkup = ReactDOMServer.renderToString(
        <StaticRouter location={req.url} context={{}}>
            <App />
        </StaticRouter>
    );

    res.send(`
        <html>
            <head>
                <title>Gamified LMS</title>
            </head>
            <body>
                <div id="root">${initialMarkup}</div>
                <script src="/main.js"></script>
            </body>
        </html>
    `);
});


mongoose.connect(config.get('DB_URI'), { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if(err) return console.log(err);

    server.listen(PORT, () => console.log(`server listening on port ${PORT}`));
});

process.on('SIGINT', () => {
    mongoose.disconnect();
    process.exit();
});