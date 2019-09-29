import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Container,
    Row,
    Col,
    Button
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

        if (this.props.currentCourseForTeacher && !this.state.currentCourseTitle) {
            this.setState({
                currentCourseTitle: this.props.currentCourseForTeacher.title,
                currentCourseDesc: this.props.currentCourseForTeacher.description,
                currentCoursePrice: this.props.currentCourseForTeacher.price,
                currentCourseLessons: this.props.currentCourseForTeacher.lessons
            });
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
                currentCourseLessons
            } = this.state;
    
            if (title == currentCourseTitle && description == currentCourseDesc
                && price == currentCoursePrice
                && (JSON.stringify(lessons) == JSON.stringify(currentCourseLessons))
                && !this.state.serverClientSynched) {
                    this.setState({
                        serverClientSynched: true
                    });
            } else if ((title != currentCourseTitle || description != currentCourseDesc
                || price != currentCoursePrice
                || (JSON.stringify(lessons) != JSON.stringify(currentCourseLessons)))
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
        serverClientSynched: false
    }

    onDeleteLessonFromCourse = (lessonId) => {
        console.log('lesson id: ' + lessonId);
    }

    onEnroll = () => {
        console.log('enrolled');
    }

    onSaveChanges = () => {
        console.log('saving changes!');
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const {
            isAuthenticated,
            isTeacher,
            currentTeacher,
            currentCourseForTeacher
        } = this.props;

        const {
            currentCourseTitle,
            currentCourseDesc,
            currentCoursePrice,
            currentCourseLessons,
            saveChangesError,
            serverClientSynched
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