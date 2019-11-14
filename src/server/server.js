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
import exerciseRoutes from './routes/exerciseRoutes';
import audioExercisesRoutes from './routes/audioExerciseRoutes';

// components
import App from '../components/App';
import SplashView from '../components/SplashView';
import LoginView from '../components/LoginView';
import Register from '../components/Register';

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
server.use('/api/exercises', exerciseRoutes);
server.use('/api/exercises', audioExercisesRoutes);

server.get('/*', (req, res) => {
    const store = createStore(reducers);

    let comp = null;
    if (req.url === '/preparing') {
        comp = <SplashView />;
    } else if (req.url === '/login') {
        comp = <LoginView />;
    } else if (req.url === '/register') {
        comp = <Register />;
    } else {
        comp = <App />;
    }

    const initialMarkup = ReactDOMServer.renderToString(
        <Provider store={store}>
            <StaticRouter location={req.url} context={{}}>
                { comp }
            </StaticRouter>
        </Provider>
    );

    res.send(`
        <html>
            <head>
                <title>${config.get('appName')}</title>
                <link rel="stylesheet"
                    href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
                    crossorigin="anonymous">
                <link rel="stylesheet" href="/css/styles.css">
            </head>
            <body>
                <div id="root">${initialMarkup}</div>
                <script src="https://cdn.rawgit.com/mattdiamond/Recorderjs/08e7abd9/dist/recorder.js"></script>
            
                <!-- The core Firebase JS SDK is always required and must be listed first -->
                <script src="https://www.gstatic.com/firebasejs/7.3.0/firebase-app.js"></script>
                <script src="https://www.gstatic.com/firebasejs/7.3.0/firebase-storage.js"></script>

                <!-- TODO: Add SDKs for Firebase products that you want to use
                    https://firebase.google.com/docs/web/setup#available-libraries -->

                <script>
                    // Your web app's Firebase configuration
                    var firebaseConfig = {
                        
                    };
                    // Initialize Firebase
                    firebase.initializeApp(firebaseConfig);
                </script>

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