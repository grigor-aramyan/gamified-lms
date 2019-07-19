import express from 'express';
import mongoose from 'mongoose';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import config from 'config';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from '../reducers';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import learnerRoutes from './routes/learnerRoutes';
import teacherRoutes from './routes/teacherRoutes';
import lessonRoutes from './routes/lessonRoutes';
import courseRoutes from './routes/courseRoutes';
import lessonOngoingRoutes from './routes/lessonOngoingRoutes';
import courseOngoingRoutes from './routes/courseOngoingRoutes';

import App from '../components/App';

const PORT = process.env.PORT || 4242;

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
server.use('/api/lesson_ongoings', lessonOngoingRoutes);
server.use('/api/course_ongoings', courseOngoingRoutes);


server.get('/*', (req, res) => {
    const store = createStore(reducers);

    const initialMarkup = ReactDOMServer.renderToString(
        <Provider store={store}>
            <StaticRouter location={req.url} context={{}}>
                <App />
            </StaticRouter>
        </Provider>
    );

    res.send(`
        <html>
            <head>
                <title>Gamified LMS</title>
                <link rel="stylesheet"
                    href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
                    crossorigin="anonymous">
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

    server.listen(process.env.PORT, () => console.log(`server listening on port ${PORT}`));
});

process.on('SIGINT', () => {
    mongoose.disconnect();
    process.exit();
});