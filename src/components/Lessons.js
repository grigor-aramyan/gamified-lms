import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Container,
    Button
} from 'reactstrap';

import { loadLocalToken, loadUser } from '../actions/authActions';
import { getLessons } from '../actions/lessonActions';

import Header from './Header';

import AddLesson from './AddLesson';
import NotAuthenticated from './NotAuthenticated';
import ListAllLessons from './ListAllLessons';
import AddCourse from './AddCourse';

class Lessons extends Component {
    componentDidMount() {
        this.props.loadLocalToken();
        this.props.loadUser();
    }

    componentDidUpdate() {
        if (this.props.isAuthenticated && !this.props.allLessons) {
            this.props.getLessons();
        }
    }

    state = {
        lessonsForNewCourse: [],
        addContentVisible: false
    }

    toggleLessonForNewCourse = (lessonId) => {
        if (this.state.lessonsForNewCourse.includes(lessonId)) {
            const data = this.state.lessonsForNewCourse.filter(l => {
                if (l === lessonId) return false;

                return true;
            });

            this.setState({ lessonsForNewCourse: data });

        } else {
            const data = [...this.state.lessonsForNewCourse];
            data.unshift(lessonId);
            this.setState({ lessonsForNewCourse: data });
        }
    }

    render() {
        const {
            isAuthenticated,
            isTeacher,
            allLessons,
            error
        } = this.props;

        const {
            addContentVisible
        } = this.state;

        const switcherStyle = {
            backgroundColor: 'deepskyblue',
            border: 'none'
        };

        return(
            <div>
                { (isAuthenticated && isTeacher) ?
                    <div>
                        <Header />
                        <Container>
                            { addContentVisible ?
                                <div>
                                    <Button
                                        className='ml-4 mt-2'
                                        style={switcherStyle}
                                        onClick={() => { this.setState({ addContentVisible: false }); }}>
                                            All Lessons
                                    </Button>
                                    <hr />
                                </div>
                            : <div>
                                <Button
                                    className='ml-4 mt-2'
                                    style={switcherStyle}
                                    onClick={() => { this.setState({ addContentVisible: true }); }}>
                                        Add Lesson
                                </Button>
                                <hr />
                            </div>
                            }
                            { !addContentVisible ?
                                <AddCourse
                                    lessonsForNewCourse={ this.state.lessonsForNewCourse }
                                /> : null
                            }
                            { addContentVisible ?
                                (allLessons ?
                                    <AddLesson
                                        allLessonsCount={ allLessons.length }
                                        lastLesson={ allLessons[0] }
                                        />
                                    : <AddLesson
                                        allLessonsCount={ 0 }
                                        lastLesson={null}
                                        />)
                                : null
                                
                            }
                            <hr />
                            { (allLessons && !addContentVisible) ?
                                <ListAllLessons
                                    allLessons={ allLessons }
                                    isTeacher={ isTeacher }
                                    error={ error }
                                    toggleLessonForNewCourse={ this.toggleLessonForNewCourse }
                                    />
                                : null 
                            }
                        </Container>           
                    </div>
                    : null
                }
                { (isAuthenticated && !isTeacher) ?
                    <div>
                        <Header />
                        <Container>
                            {allLessons ?
                                <ListAllLessons
                                    allLessons={ allLessons }
                                    isTeacher={ isTeacher }
                                    error={ error }
                                    />
                                : null 
                            }
                        </Container>           
                    </div>
                    : null
                }
                { !isAuthenticated ?
                    <NotAuthenticated /> 
                    : null
                }
            </div>
        );
    }
}

Lessons.propTypes = {
    isAuthenticated: PropTypes.bool,
    isTeacher: PropTypes.bool.isRequired,
    loadLocalToken: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired,
    allLessons: PropTypes.array,
    getLessons: PropTypes.func.isRequired,
    error: PropTypes.object
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isTeacher: state.auth.isTeacher,
    allLessons: state.lesson.allLessons,
    error: state.error
});

export default connect(mapStateToProps, {
    loadLocalToken,
    loadUser,
    getLessons
})(Lessons);