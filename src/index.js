import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import App from './components/App';
import LoginView from './components/LoginView';
import Register from './components/Register';
import Lessons from './components/Lessons';
import Courses from './components/Courses';
import LessonOngoings from './components/LessonOngoings';
import CourseOngoings from './components/CourseOngoings';
import Learners from './components/Learners';
import Teachers from './components/Teachers';
import LessonView from './components/LessonView';
import CourseView from './components/CourseView';
import SplashView from './components/SplashView';

ReactDOM.hydrate(
    <Provider store={store}>
        <Router>
            <Route path='/'>
                <Switch>
                    <Route exact path='/' component={App} />
                    <Route path='/preparing' component={SplashView} />
                    <Route path='/login' component={LoginView} />
                    <Route path='/register' component={Register} />
                    <Route path='/lessons' component={Lessons} />
                    <Route path='/courses' component={Courses} />
                    <Route path='/lesson_ongoings/lesson/:id' component={LessonView} />
                    <Route path='/lesson_ongoings' component={LessonOngoings} />
                    <Route path='/course_ongoings/course/:id' component={CourseView} />
                    <Route path='/course_ongoings' component={CourseOngoings} />
                    <Route path='/learners' component={Learners} />
                    <Route path='/teachers' component={Teachers} />
                    <Route path='/*' render={ () => {
                        return(
                            <div>
                                Component not implemented yet!)
                            </div>
                        );
                    }} />
                </Switch>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);