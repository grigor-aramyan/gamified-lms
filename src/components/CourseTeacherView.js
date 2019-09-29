import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Container
} from 'reactstrap';

import { loadLocalToken, loadUser } from '../actions/authActions';
import { getExtendedCourseById } from '../actions/courseActions';

import Header from './Header';
import NotAuthenticated from './NotAuthenticated';

class CourseTeacherView extends Component {
    componentDidMount() {
        this.props.loadLocalToken();
        this.props.loadUser();
    }

    render() {
        const {
            isAuthenticated,
            isTeacher,
            currentTeacher,
            currentCourseForTeacher
        } = this.props;

        return(
            <div>
                Course teacher view goes here!
            </div>
        );
    }
}

CourseTeacherView.propTypes = {
    error: PropTypes.object,
    isAuthenticated: PropTypes.bool,
    isTeacher: PropTypes.bool.isRequired,
    loadLocalToken: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired,
    currentTeacher: PropTypes.object,
    getExtendedCourseById: PropTypes.func.isRequired,
    currentCourseForTeacher: PropTypes.object
}

const mapStateToProps = (state) => ({
    error: state.error,
    isAuthenticated: state.auth.isAuthenticated,
    isTeacher: state.auth.isTeacher,
    currentTeacher: state.auth.teacher,
    currentCourseForTeacher: state.course.currentCourseForTeacher
});

export default connect(mapStateToProps, {
    loadLocalToken,
    loadUser,
    getExtendedCourseById
})(CourseTeacherView);