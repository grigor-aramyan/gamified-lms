import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Container,
    Row,
    Col,
    Button,
    Spinner
} from 'reactstrap';

import { loadLocalToken, loadUser } from '../actions/authActions';
import { getExtendedCourseById, updateCourse } from '../actions/courseActions';
import { getLessons } from '../actions/lessonActions';
import { createCourseOngoing } from '../actions/courseOngoingActions';

// Components
import Header from './Header';
import ListAllLessons from './ListAllLessons';
import NotAuthenticated from './NotAuthenticated';

class CourseTeacherView extends Component {
    componentDidMount() {
        this.props.loadLocalToken();
        this.props.loadUser();
    }

    componentDidUpdate() {
        if ((this.props.currentCourseForTeacher == null)
            && this.props.isAuthenticated
            //&& this.props.isTeacher
            && this.state.currentCourseId == null) {
            const href = window.location.href;
            const parts = href.split('/');
            const courseId = parts[parts.length - 1];
            this.setState({
                currentCourseId: courseId
            });
            this.props.getExtendedCourseById(courseId);
        }

        if (this.props.currentCourseForTeacher && !this.state.currentCourseTitle && !this.state.spinnerOpened) {
            this.setState({
                currentCourseTitle: this.props.currentCourseForTeacher.title,
                currentCourseDesc: this.props.currentCourseForTeacher.description,
                currentCoursePrice: this.props.currentCourseForTeacher.price,
                currentCourseLessons: this.props.currentCourseForTeacher.lessons
            });
        }

        const {
            isAuthenticated,
            isTeacher,
            currentTeacher,
            currentCourseForTeacher,
            allLessons
        } = this.props;

        if (isAuthenticated && isTeacher && currentCourseForTeacher &&
            (currentCourseForTeacher.authorId === currentTeacher.id) && !allLessons) {
            this.props.getLessons();
        }

        if (this.props.currentCourseForTeacher) {
            const {
                title,
                description,
                price,
                lessons
            } = this.props.currentCourseForTeacher;
            
            const {
                currentCourseTitle,
                currentCourseDesc,
                currentCoursePrice,
                currentCourseLessons,
                deletingLessonIds,
                addingLessonIds
            } = this.state;
    
            if (title == currentCourseTitle && description == currentCourseDesc
                && price == currentCoursePrice
                && (JSON.stringify(lessons) == JSON.stringify(currentCourseLessons)
                && (deletingLessonIds.length === 0)
                && (addingLessonIds.length === 0))
                && !this.state.serverClientSynched) {
                    this.setState({
                        serverClientSynched: true,
                        spinnerOpened: false,
                        saveChangesError: ''
                    });
            } else if ((title != currentCourseTitle || description != currentCourseDesc
                || price != currentCoursePrice
                || (JSON.stringify(lessons) != JSON.stringify(currentCourseLessons))
                || (deletingLessonIds.length !== 0)
                || (addingLessonIds.length !== 0))
                && this.state.serverClientSynched) {
                this.setState({
                    serverClientSynched: false
                });
            }
        }
    }

    state = {
        currentCourseId: null,
        currentCourseTitle: '',
        currentCourseDesc: '',
        currentCoursePrice: null,
        currentCourseLessons: null,
        saveChangesError: '',
        serverClientSynched: false,
        deletingLessonIds: [],
        addingLessonIds: [],
        spinnerOpened: false
    }

    onDeleteLessonFromCourse = (lessonId) => {
        let intermediateArray = this.state.deletingLessonIds;
        intermediateArray.push(lessonId);

        this.setState({
            deletingLessonIds: intermediateArray
        });
    }

    onEnroll = () => {
        const params = {
            courseId: this.state.currentCourseId
        };

        this.setState({
            spinnerOpened: true
        });
        this.props.createCourseOngoing(params);
        setTimeout(() => {
            window.open('/course_ongoings', '_self');
        }, 3 * 1000);
    }

    onSaveChanges = () => {

        const {
            currentCourseForTeacher
        } = this.props;

        const {
            lessons
        } = currentCourseForTeacher;

        const {
            addingLessonIds,
            deletingLessonIds,
            currentCourseTitle,
            currentCourseDesc,
            currentCoursePrice
        } = this.state;

        const initialArray = lessons.map(l => {
            return l.id;
        });

        const intermediateArray = initialArray.filter(l => {
            return (!deletingLessonIds.includes(l));
        });

        const updatedLessons = intermediateArray.concat(addingLessonIds);

        if (!currentCourseTitle || !currentCourseDesc) {
            this.setState({
                saveChangesError: 'Course title and description are required!'
            });
        } else if (updatedLessons.length < 2) {
            this.setState({
                saveChangesError: 'Course should contain at least 2 lessons!'
            });
        } else {
            const params = {
                title: currentCourseTitle,
                description: currentCourseDesc,
                price: currentCoursePrice,
                lessons: updatedLessons
            };

            this.setState({
                spinnerOpened: true
            });
            this.props.updateCourse(currentCourseForTeacher.id, params);

            setTimeout(() => {
                window.open(`/courses/${this.state.currentCourseId}`, '_self');
            }, 3 * 1000);
        }
    }

    toggleLessonForNewCourse = (lessonId) => {
        if (this.state.addingLessonIds.includes(lessonId)) {
            const data = this.state.addingLessonIds.filter(l => {
                return (l !== lessonId);
            });

            this.setState({ addingLessonIds: data });

        } else {
            const data = [...this.state.addingLessonIds];
            data.unshift(lessonId);
            this.setState({ addingLessonIds: data });
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const {
            isAuthenticated,
            isTeacher,
            currentTeacher,
            currentCourseForTeacher,
            allLessons,
            error
        } = this.props;

        const {
            currentCourseTitle,
            currentCourseDesc,
            currentCoursePrice,
            currentCourseLessons,
            saveChangesError,
            serverClientSynched,
            deletingLessonIds,
            addingLessonIds,
            spinnerOpened
        } = this.state;

        let titleInput = null;
        if (currentCourseForTeacher && currentTeacher && (currentTeacher.id === currentCourseForTeacher.authorId)) {
            titleInput =
                <input
                    style={{
                        textAlign: 'center',
                        border: 'none',
                        borderRadius: '5%',
                        width: '100%',
                        backgroundColor: 'white'
                    }}
                    className='h2'
                    onChange={this.onChange}
                    name='currentCourseTitle'
                    value={ currentCourseTitle ? currentCourseTitle : '' }
                    placeholder='Course title...' />
        } else {
            titleInput =
                <input
                    style={{
                        textAlign: 'center',
                        border: 'none',
                        borderRadius: '5%',
                        width: '100%',
                        backgroundColor: 'white'
                    }}
                    className='h2'
                    onChange={this.onChange}
                    name='currentCourseTitle'
                    value={ currentCourseTitle ? currentCourseTitle : '' }
                    placeholder='Course title...'
                    disabled />
        }

        let descInput = null;
        if (currentCourseForTeacher && currentTeacher && (currentTeacher.id === currentCourseForTeacher.authorId)) {
            descInput =
                <input style={{
                    fontStyle: 'italic',
                    textAlign: 'center',
                    border: 'none',
                    width: '100%',
                    backgroundColor: 'white'
                }}
                onChange={this.onChange}
                name='currentCourseDesc'
                value={ currentCourseDesc ? currentCourseDesc : '' }
                placeholder='Course description' />
        } else {
            descInput =
                <input style={{
                    fontStyle: 'italic',
                    textAlign: 'center',
                    border: 'none',
                    width: '100%',
                    backgroundColor: 'white'
                }}
                onChange={this.onChange}
                name='currentCourseDesc'
                value={ currentCourseDesc ? currentCourseDesc : '' }
                placeholder='Course description'
                disabled />
        }

        let priceInput = null;
        if (!currentCourseForTeacher || (isAuthenticated && !isTeacher)) {
            priceInput = null;
        } else if (isAuthenticated && isTeacher && currentCourseForTeacher && currentTeacher && (currentCourseForTeacher.authorId === currentTeacher.id)) {
            priceInput =
                <div>
                    $
                    <input
                        style={{
                            width: '10vw'
                        }}
                        className='mt-1'
                        value={currentCoursePrice ? currentCoursePrice : 0}
                        min={0}
                        type='number'
                        name='currentCoursePrice'
                        onChange={this.onChange}
                    />
                </div>
        } else if (isAuthenticated && isTeacher && currentCourseForTeacher && currentTeacher && (currentCourseForTeacher.authorId !== currentTeacher.id)) {
            priceInput =
                <div>
                    $
                    <input
                        style={{
                            width: '10vw',
                            backgroundColor: 'white',
                            border: 'none'
                        }}
                        className='mt-1'
                        value={currentCoursePrice ? currentCoursePrice : 0}
                        min={0}
                        type='number'
                        name='currentCoursePrice'
                        onChange={this.onChange}
                        disabled
                    />
                </div>
        } else {
            priceInput = null;
        }

        let courseLessons = null;
        if (isAuthenticated && isTeacher && currentCourseForTeacher && currentTeacher && currentCourseLessons && (currentCourseForTeacher.authorId === currentTeacher.id)) {
            courseLessons =
                (<div>
                    <hr />
                    <h5>Lessons</h5>
                    <ol>
                        { currentCourseLessons.map(l => {
                            if (deletingLessonIds.includes(l.id)) {
                                return(
                                    <li key={l.id}>
                                        <p
                                            style={{
                                                color: 'red',
                                                fontStyle: 'italic'
                                            }}>
                                                Deleted:
                                            <span
                                                className='ml-1'
                                                style={{
                                                    color: 'grey'
                                                }}>
                                                { l.title }
                                            </span>
                                        </p>
                                    </li>
                                );
                            } else {
                                return(
                                    <li key={l.id}>
                                        <a href={ `/lessons/${l.id}` }>{ l.title }</a>
                                        <Button
                                            onClick={ () => this.onDeleteLessonFromCourse(l.id) }
                                            style={{
                                                color: 'red',
                                                backgroundColor: 'white',
                                                border: '1px solid grey',
                                                borderRadius: '20%',
                                                fontSize: '80%'
                                            }}
                                            className='ml-2 mb-1'>
                                            X
                                        </Button>
                                    </li>
                                );
                            }
                        }) }
                    </ol>
                </div>)
        } else if (isAuthenticated && currentCourseForTeacher && currentCourseLessons) {
            courseLessons =
                (<div>
                    <hr />
                    <h5>Lessons</h5>
                    <ol>
                        { currentCourseLessons.map(l => {
                            return(
                                <li key={l.id}>
                                    <a href={ `/lessons/${l.id}` }>{ l.title }</a>
                                </li>
                            );
                        }) }
                    </ol>
                </div>)
        }

        let spinnerStyle = null;
        if (spinnerOpened) {
            spinnerStyle = {
                visibility: 'visible',
                display: 'block',
                width: '99vw',
                height: '100vh',
                backgroundColor: 'rgba(211, 211, 211, 0.8)',
                textAlign: 'center',
                position: 'absolute',
                top: '0',
                left: '0'
            };
        } else {
            spinnerStyle = {
                display: 'none',
                visibility: 'hidden'
            };
        }

        return(
            <div>
                <Header />
                { isAuthenticated ?
                    <Container>
                        { titleInput }
                        { descInput }
                        { priceInput }
                        { courseLessons }
                        { (isAuthenticated && !isTeacher) ?
                            <div>
                                <hr />
                                <Button
                                    onClick={this.onEnroll}
                                    style={{
                                        backgroundColor: 'gold',
                                        color: 'grey',
                                        border: 'none'
                                    }}
                                    className='mr-2 mt-2'>
                                    Enroll
                                </Button>
                                { currentCourseForTeacher ?
                                    <span
                                        style={{
                                            border: '1px solid grey',
                                            borderRadius: '30%',
                                            padding: '0.3em'
                                        }}>
                                            { '$' + currentCourseForTeacher.price }
                                    </span>
                                : '$0'
                                }
                            </div>
                        : null
                        }
                        { (isAuthenticated && isTeacher && currentCourseForTeacher && currentTeacher && (currentCourseForTeacher.authorId === currentTeacher.id)) ?
                            <div>
                                { saveChangesError ?
                                    <span style={{
                                        display: 'block',
                                        color: 'red',
                                        fontSize: '90%',
                                        fontStyle: 'italic'
                                    }}>{saveChangesError}</span> : null
                                }
                                { serverClientSynched ?
                                    <div>
                                        <br />
                                        <span 
                                            style={{
                                                padding: '0.3em',
                                                color: 'green',
                                                border: '1px solid green',
                                                borderRadius: '20%',
                                                fontSize: '90%',
                                                fontStyle: 'italic'
                                            }}
                                            className='mb-1'>Lesson data is up to date!</span>
                                    </div>
                                : null
                                }
                                <Button
                                    onClick={this.onSaveChanges}
                                    style={{
                                        backgroundColor: 'deepskyblue',
                                        border: 'none'
                                    }}
                                    className='mt-2'>
                                    Save changes
                                </Button>
                                { (addingLessonIds.length > 0) ?
                                    <div>
                                        <hr />
                                        <h5>Adding lesson IDs</h5>
                                        <ol>
                                            { addingLessonIds.map(l => {
                                                return (
                                                    <li key={l}>
                                                        { l }
                                                    </li>
                                                );
                                            }) }
                                        </ol>
                                    </div>
                                : null
                                }
                                { (allLessons && (allLessons.length > 0)) ?
                                    <div>
                                        <hr />
                                        <ListAllLessons
                                            allLessons={ allLessons }
                                            isTeacher={ isTeacher }
                                            error={ error }
                                            toggleLessonForNewCourse={ this.toggleLessonForNewCourse } />    
                                    </div>
                                : null
                                }
                            </div>
                        : null
                        }
                        <div style={spinnerStyle}>
                            <Spinner
                                style={{
                                    width: '20vw',
                                    height: '20vw',
                                    marginTop: '20vh',
                                    color: 'deepskyblue'
                                }}
                                type='grow' />
                        </div>
                    </Container>
                : <NotAuthenticated />
                }
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
    currentCourseForTeacher: PropTypes.object,
    allLessons: PropTypes.array,
    getLessons: PropTypes.func.isRequired,
    updateCourse: PropTypes.func.isRequired,
    createCourseOngoing: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
    isAuthenticated: state.auth.isAuthenticated,
    isTeacher: state.auth.isTeacher,
    currentTeacher: state.auth.teacher,
    currentCourseForTeacher: state.course.currentCourseForTeacher,
    allLessons: state.lesson.allLessons,
});

export default connect(mapStateToProps, {
    loadLocalToken,
    loadUser,
    getExtendedCourseById,
    getLessons,
    updateCourse,
    createCourseOngoing
})(CourseTeacherView);