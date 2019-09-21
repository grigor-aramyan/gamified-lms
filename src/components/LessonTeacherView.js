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

    componentDidUpdate() {
        const href = window.location.href;
        const parts = href.split('/');
        const lessonId = parts[parts.length - 1];
        this.setState({
            currentLessonId: lessonId
        });
    }

    state = {
        currentLessonId: null
    }

    render() {
        const {
            isAuthenticated,
            isTeacher
        } = this.props;

        return(
            <div>
                <Header />
                { isAuthenticated && isTeacher ?
                    <Container>
                        Lesson teacher view
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