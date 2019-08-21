import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Container,
    Row,
    Col
} from 'reactstrap';

import { loadLocalToken, loadUser } from '../actions/authActions';
import { getExtendedCourseByCourseOngoingId } from '../actions/courseOngoingActions';

import Header from './Header';
import NotAuthenticated from './NotAuthenticated';
import CourseSingleLesson from './CourseSingleLesson';

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
        currentCourseOngoingId: null,
        currentlySelectedCourseLessonId: null
    }

    onSelectNewLesson = (lessonId) => {

        this.setState({
            currentlySelectedCourseLessonId: lessonId
        });
    }

    render() {
        const {
            isAuthenticated,
            isTeacher,
            extendedCourse,
            error
        } = this.props;

        const labelsStyle = {
            color: 'deepskyblue'
        }

        return(
            <div>
                <Header />
                { isAuthenticated && !isTeacher ?
                    <Container>
                        <h2>Selected course</h2>
                        <Row style={{ textAlign: 'center' }}>
                            <Col xs='4' style={labelsStyle}>
                                TITLE
                            </Col>
                            <Col xs='4' style={labelsStyle}>
                                LESSONS
                            </Col>
                            <Col xs='1' style={labelsStyle}>
                                PRICE
                            </Col>
                        </Row>
                        <hr />
                        { extendedCourse ?
                            <div>
                                <Row>
                                    <Col xs='4' style={{ textAlign: 'center' }}>
                                        {extendedCourse.title}
                                    </Col>
                                    <Col xs='4'>
                                        <ol>
                                            { extendedCourse.lessons.map(l => {
                                                return(
                                                    <li key={l.id}>
                                                        <a href='#'
                                                            onClick={() => this.onSelectNewLesson(l.id)}>
                                                            {l.title}
                                                        </a>
                                                    </li>
                                                );
                                            }) }
                                        </ol>
                                    </Col>
                                    <Col xs='1'>
                                        {`$${extendedCourse.price}`}
                                    </Col>
                                </Row>
                                <h3>Selected course lesson</h3>
                                <CourseSingleLesson
                                    selectedLessonId={this.state.currentlySelectedCourseLessonId} />
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