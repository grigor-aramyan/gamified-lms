import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Container
} from 'reactstrap';

import { loadLocalToken, loadUser } from '../actions/authActions';

import Header from './Header';
import NotAuthenticated from './NotAuthenticated';

class LessonTeacherView extends Component {
    componentDidMount() {
        this.props.loadLocalToken();
        this.props.loadUser();
    }

    render() {
        return(
            <div>
                Lesson Teacher View
            </div>
        );
    }
}

LessonTeacherView.propTypes = {
    error: PropTypes.object,
    loadLocalToken: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    isTeacher: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
    isAuthenticated: state.auth.isAuthenticated,
    isTeacher: state.auth.isTeacher
});

export default connect(mapStateToProps, {
    loadLocalToken,
    loadUser
})(LessonTeacherView);