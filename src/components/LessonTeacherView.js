import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Container,
    Button
} from 'reactstrap';

import { loadLocalToken, loadUser } from '../actions/authActions';
import { getLessonForTeacherById, updateLesson } from '../actions/lessonActions';
import { createLessonOngoing } from '../actions/lessonOngoingActions';

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

        if (this.props.currentLessonForTeacher && !this.state.currentLessonTitle) {
            this.setState({
                currentLessonTitle: this.props.currentLessonForTeacher.title,
                currentLessonDesc: this.props.currentLessonForTeacher.description,
                currentLessonContent: this.props.currentLessonForTeacher.content,
                currentLessonPrice: this.props.currentLessonForTeacher.price
            });
        }

        if (this.props.currentLessonForTeacher) {
            let title, description, content, price;
            
            title = this.props.currentLessonForTeacher.title;
            description = this.props.currentLessonForTeacher.description;
            content = this.props.currentLessonForTeacher.content;
            price = this.props.currentLessonForTeacher.price;
        
            const {
                currentLessonTitle,
                currentLessonDesc,
                currentLessonContent,
                currentLessonPrice
            } = this.state;
    
            if (title == currentLessonTitle && description == currentLessonDesc
                && content == currentLessonContent && price == currentLessonPrice
                && !this.state.serverClientSynched) {
                    this.setState({
                        serverClientSynched: true
                    });
            } else if ((title != currentLessonTitle || description != currentLessonDesc
                || content != currentLessonContent || price != currentLessonPrice)
                && this.state.serverClientSynched) {
                this.setState({
                    serverClientSynched: false
                });
            }
        }

        if (this.props.allLessonOngoings.length > this.state.allLessonOngoingsCount) {
            window.open('/lesson_ongoings', '_self');
        }
    }

    state = {
        currentLessonId: null,
        currentLessonTitle: '',
        currentLessonDesc: '',
        currentLessonContent: '',
        currentLessonPrice: null,
        saveChangesError: '',
        serverClientSynched: false,
        allLessonOngoingsCount: 0
    }

    onSaveChanges = () => {
        const {
            currentLessonId,
            currentLessonTitle,
            currentLessonDesc,
            currentLessonContent,
            currentLessonPrice,
            saveChangesError
        } = this.state;

        if (!currentLessonTitle) {
            this.setState({
                saveChangesError: 'Lesson title is mandatory!'
            });
        } else if (!currentLessonDesc) {
            this.setState({
                saveChangesError: 'Lesson description is mandatory!'
            });
        } else if (!currentLessonContent) {
            this.setState({
                saveChangesError: 'Lesson content is mandatory!'
            });
        } else {
            const body = {
                title: currentLessonTitle,
                description: currentLessonDesc,
                content: currentLessonContent,
                price: currentLessonPrice
            };
            this.props.updateLesson(currentLessonId, body);
        }
    }

    onEnroll = () => {
        const {
            currentLessonId
        } = this.state;

        const body = {
            lessonId: currentLessonId
        }

        this.props.createLessonOngoing(body);
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const {
            isAuthenticated,
            isTeacher,
            currentLessonForTeacher,
            currentTeacher
        } = this.props;

        const {
            currentLessonTitle,
            currentLessonDesc,
            currentLessonContent,
            currentLessonPrice,
            saveChangesError,
            serverClientSynched
        } = this.state;

        let contentInput = null;
        if (currentLessonForTeacher && currentTeacher && (currentLessonForTeacher.authorId === currentTeacher.id)) {
            contentInput =
                <input
                    style={{
                        border: '1px solid grey',
                        borderRadius: '10%',
                        padding: '3vw',
                        width: '100%',
                        backgroundColor: 'white'
                    }}
                    onChange={this.onChange}
                    name='currentLessonContent'
                    value={ currentLessonContent ? currentLessonContent : '' }
                    placeholder='Lesson content' />
        } else {
            contentInput =
                <input
                    style={{
                        border: '1px solid grey',
                        borderRadius: '10%',
                        padding: '3vw',
                        width: '100%',
                        backgroundColor: 'white'
                    }}
                    onChange={this.onChange}
                    name='currentLessonContent'
                    onChange={this.onChange}
                    value={ currentLessonContent ? currentLessonContent : '' }
                    placeholder='Lesson content'
                    disabled />
        }

        let descInput = null;
        if (currentLessonForTeacher && currentTeacher && (currentLessonForTeacher.authorId === currentTeacher.id)) {
            descInput =
                <input style={{
                    fontStyle: 'italic',
                    textAlign: 'center',
                    border: 'none',
                    width: '100%',
                    backgroundColor: 'white'
                }}
                onChange={this.onChange}
                name='currentLessonDesc'
                value={ currentLessonDesc ? currentLessonDesc : '' }
                placeholder='Lesson description' />
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
                name='currentLessonDesc'
                value={ currentLessonDesc ? currentLessonDesc : '' }
                placeholder='Lesson description'
                disabled />
        }

        let titleInput = null;
        if (currentLessonForTeacher && currentTeacher && (currentLessonForTeacher.authorId === currentTeacher.id)) {
            titleInput =
                <input
                style={{
                    textAlign: 'center',
                    border: 'none',
                    borderRadius: '5%',
                    width: '100%',
                    backgroundColor: 'white'
                }}
                onChange={this.onChange}
                name='currentLessonTitle'
                className='h2'
                value={ currentLessonTitle ? currentLessonTitle : '' }
                placeholder='Lesson title' />
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
                    onChange={this.onChange}
                    name='currentLessonTitle'
                    className='h2'
                    value={ currentLessonTitle ? currentLessonTitle : '' }
                    placeholder='Lesson title'
                    disabled />
        }

        let priceInput = null;
        if (!currentLessonForTeacher || (isAuthenticated && !isTeacher)) {
            priceInput = null;
        } else if (isAuthenticated && isTeacher && currentLessonForTeacher && currentTeacher && (currentLessonForTeacher.authorId === currentTeacher.id)) {
            priceInput =
                <input
                    style={{
                        width: '10vw',
                        display: 'block'
                    }}
                    className='mt-1'
                    value={currentLessonPrice ? currentLessonPrice : 0}
                    min={0}
                    type='number'
                    name='currentLessonPrice'
                    onChange={this.onChange}
                />
        } else if (isAuthenticated && isTeacher && currentLessonForTeacher && currentTeacher && (currentLessonForTeacher.authorId !== currentTeacher.id)) {
            priceInput =
                <input
                    style={{
                        width: '10vw',
                        display: 'block'
                    }}
                    className='mt-1'
                    value={currentLessonPrice ? currentLessonPrice : 0}
                    min={0}
                    type='number'
                    name='currentLessonPrice'
                    onChange={this.onChange}
                    disabled
                />
        } else {
            priceInput = null;
        }

        return(
            <div>
                <Header />
                { isAuthenticated ?
                    <Container>
                        { titleInput }
                        { descInput }
                        { contentInput }
                        { priceInput }
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
                                { currentLessonForTeacher ?
                                    <span
                                        style={{
                                            border: '1px solid grey',
                                            borderRadius: '30%',
                                            padding: '0.3em'
                                        }}>
                                            { '$' + currentLessonForTeacher.price }
                                    </span>
                                : '$0'
                                }
                            </div>
                        : null
                        }
                        { (isAuthenticated && isTeacher) ?
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

LessonTeacherView.propTypes = {
    error: PropTypes.object,
    loadLocalToken: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    isTeacher: PropTypes.bool.isRequired,
    currentLessonForTeacher: PropTypes.object,
    currentTeacher: PropTypes.object,
    getLessonForTeacherById: PropTypes.func.isRequired,
    updateLesson: PropTypes.func.isRequired,
    createLessonOngoing: PropTypes.func.isRequired,
    allLessonOngoings: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
    isAuthenticated: state.auth.isAuthenticated,
    isTeacher: state.auth.isTeacher,
    currentLessonForTeacher: state.lesson.currentLessonForTeacher,
    currentTeacher: state.auth.teacher,
    allLessonOngoings: state.lessonOngoing.allLessonOngoings
});

export default connect(mapStateToProps, {
    loadLocalToken,
    loadUser,
    getLessonForTeacherById,
    updateLesson,
    createLessonOngoing
})(LessonTeacherView);