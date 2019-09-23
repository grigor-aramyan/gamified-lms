import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Container,
    Button
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

        if (this.props.currentLessonForTeacher && !this.state.currentLessonTitle) {
            this.setState({
                currentLessonTitle: this.props.currentLessonForTeacher.title,
                currentLessonDesc: this.props.currentLessonForTeacher.description,
                currentLessonContent: this.props.currentLessonForTeacher.content,
                currentLessonPrice: this.props.currentLessonForTeacher.price
            });
        }
    }

    state = {
        currentLessonId: null,
        currentLessonTitle: '',
        currentLessonDesc: '',
        currentLessonContent: '',
        currentLessonPrice: null
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
            currentLessonPrice
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
                                <Button
                                    style={{
                                        backgroundColor: 'gold',
                                        color: 'grey',
                                        border: 'none'
                                    }}
                                    className='mr-2 mt-2'>
                                    Enroll
                                </Button>
                                { currentLessonForTeacher ? '$' + currentLessonForTeacher.price : '$0' }
                            </div>
                        : null
                        }
                        { (isAuthenticated && isTeacher) ?
                            <Button
                                style={{
                                    backgroundColor: 'deepskyblue',
                                    border: 'none'
                                }}
                                className='mt-2'>
                                Save changes
                            </Button>
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