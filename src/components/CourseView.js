import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Container
} from 'reactstrap';

import { loadLocalToken, loadUser } from '../actions/authActions';
import { getExtendedCourseByCourseOngoingId } from '../actions/courseOngoingActions';

import Header from './Header';
import NotAuthenticated from './NotAuthenticated';

class CourseView extends Component {
    componentDidMount() {
        this.props.loadLocalToken();
        this.props.loadUser();
    }

    componentDidUpdate() {
        if ((this.props.extendedCourse == null)
            && this.props.isAuthenticated
            && !this.props.isTeacher
            && this.state.currentCourseOngoingId == null) {
            const href = window.location.href;
            const parts = href.split('/');
            const courseOngoingId = parts[parts.length - 1];
            this.setState({
                currentCourseOngoingId: courseOngoingId
            });
            this.props.getExtendedCourseByCourseOngoingId(courseOngoingId);
        }
    }

    state = {
        currentCourseOngoingId: null
    }

    render() {
        const {
            isAuthenticated,
            isTeacher,
            extendedCourse,
            error
        } = this.props;

        return(
            <div>
                <Header />
                { isAuthenticated && !isTeacher ?
                    <Container>
                        { extendedCourse ?
                            <div>
                                <ol>
                                    { extendedCourse.lessons.map(l => {
                                        return(
                                            <li key={l.id}>
                                                {l.title}
                                            </li>
                                        );
                                    })}
                                </ol>
                            </div>
                        : null
                        }
                    </Container>
                : <NotAuthenticated />
                }
            </div>
        );
    }
}

CourseView.propTypes = {
    error: PropTypes.object,
    isAuthenticated: PropTypes.bool,
    isTeacher: PropTypes.bool.isRequired,
    loadLocalToken: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired,
    getExtendedCourseByCourseOngoingId: PropTypes.func.isRequired,
    extendedCourse: PropTypes.object
}

const mapStateToProps = (state) => ({
    error: state.error,
    isAuthenticated: state.auth.isAuthenticated,
    isTeacher: state.auth.isTeacher,
    extendedCourse: state.courseOngoing.extendedCourseForSelectedOngoing
});

export default connect(mapStateToProps, {
    loadLocalToken,
    loadUser,
    getExtendedCourseByCourseOngoingId
})(CourseView);