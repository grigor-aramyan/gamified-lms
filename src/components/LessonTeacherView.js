import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Container
} from 'reactstrap';

import { loadLocalToken, loadUser } from '../actions/authActions';
import { getLessonForTeacherById } from '../actions/lessonActions';

import Header from './Header';
import NotAuthenticated from './NotAuthenticated';

class LessonTeacherView extends Component {
    componentDidMount() {
        this.props.loadLocalToken();
        this.props.loadUser();
    }

    componentDidUpdate() {
        if ((this.props.currentLessonForTeacher == null)
            && this.props.isAuthenticated
            //&& this.props.isTeacher
            && this.state.currentLessonId == null) {
            const href = window.location.href;
            const parts = href.split('/');
            const lessonId = parts[parts.length - 1];
            this.setState({
                currentLessonId: lessonId
            });
            this.props.getLessonForTeacherById(lessonId);
        }
    }

    state = {
        currentLessonId: null
    }

    render() {
        const {
            isAuthenticated,
            isTeacher,
            currentLessonForTeacher,
            currentTeacher
        } = this.props;

        return(
            <div>
                <Header />
                { isAuthenticated ?
                    <Container>
                        <p>Lesson teacher view</p>
                        Current lesson id: { currentLessonForTeacher ? currentLessonForTeacher.title : '' }
                    </Container>
                : <NotAuthenticated />
                }
            </div>
        );
    }
}

LessonTeacherView.propTypes = {
    error: PropTypes.object,
    loadLocalToken: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    isTeacher: PropTypes.bool.isRequired,
    currentLessonForTeacher: PropTypes.object,
    currentTeacher: PropTypes.object,
    getLessonForTeacherById: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
    isAuthenticated: state.auth.isAuthenticated,
    isTeacher: state.auth.isTeacher,
    currentLessonForTeacher: state.lesson.currentLessonForTeacher,
    currentTeacher: state.auth.teacher
});

export default connect(mapStateToProps, {
    loadLocalToken,
    loadUser,
    getLessonForTeacherById
})(LessonTeacherView);