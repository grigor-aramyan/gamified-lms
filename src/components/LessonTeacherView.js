import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Container,
    Button,
    FormGroup,
    Input,
    Label
} from 'reactstrap';

import { loadLocalToken, loadUser } from '../actions/authActions';
import { getLessonForTeacherById, updateLesson } from '../actions/lessonActions';
import { createLessonOngoing } from '../actions/lessonOngoingActions';
import { getSATExercisesByLessonId } from '../actions/exerciseActions';

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
        allLessonOngoingsCount: 0,
        satsOpened: false,
        deletedQuestionIds: [],
        currentSatQuestion: '',
        currentSatAnswer: '',
        currentSatAllAnswers: [],
        addSatExerciseError: '',
        currentSatRightAnswerIndex: 0,
        satExercisesAll: []
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

    onGetSatExercises = () => {
        this.props.getSATExercisesByLessonId(this.state.currentLessonId);
        this.setState({
            satsOpened: true
        });
    }

    onDeleteQuestion = (questionId) => {
        let intermediateList = this.state.deletedQuestionIds;
        intermediateList.push(questionId);
        this.setState({
            deletedQuestionIds: intermediateList
        });
    }

    addSatExerciseAnswer = () => {
        const currentAnswer = this.state.currentSatAnswer;
        if (currentAnswer) {
            let answers = this.state.currentSatAllAnswers;
            answers.unshift(currentAnswer);
            this.setState({
                currentSatAllAnswers: answers,
                currentSatAnswer: '',
                addSatExerciseError: ''
            });
        } else {
            this.setState({
                addSatExerciseError: 'SAT can\'t have empty answer'
            });
        }
    }

    addSatExerciseToAll = () => {
        const {
            currentSatQuestion,
            currentSatAllAnswers,
            currentSatRightAnswerIndex
        } = this.state;

        if (!currentSatQuestion) {
            this.setState({
                addSatExerciseError: 'Question field required!'
            });
        } else if (currentSatAllAnswers.length < 2) {
            this.setState({
                addSatExerciseError: 'All SAT questions should have at least 2 answers!'
            });
        } else {
            const o = {
                question: currentSatQuestion,
                answers: currentSatAllAnswers,
                rightAnswerIndex: currentSatRightAnswerIndex
            }

            let allSats = this.state.satExercisesAll;
            allSats.unshift(o);

            this.setState({
                satExercisesAll: allSats,
                currentSatQuestion: '',
                currentSatAllAnswers: [],
                currentSatRightAnswerIndex: 0,
                addSatExerciseError: ''
            });
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const {
            isAuthenticated,
            isTeacher,
            currentLessonForTeacher,
            currentTeacher,
            allSats
        } = this.props;

        const {
            currentLessonTitle,
            currentLessonDesc,
            currentLessonContent,
            currentLessonPrice,
            saveChangesError,
            serverClientSynched,
            satsOpened,
            deletedQuestionIds,
            currentSatQuestion,
            currentSatAnswer,
            currentSatAllAnswers,
            currentSatRightAnswerIndex,
            addSatExerciseError,
            satExercisesAll
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
                <div>
                    $
                    <input
                        style={{
                            width: '10vw'
                        }}
                        className='mt-1'
                        value={currentLessonPrice ? currentLessonPrice : 0}
                        min={0}
                        type='number'
                        name='currentLessonPrice'
                        onChange={this.onChange}
                    />
                </div>
        } else if (isAuthenticated && isTeacher && currentLessonForTeacher && currentTeacher && (currentLessonForTeacher.authorId !== currentTeacher.id)) {
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
                        value={currentLessonPrice ? currentLessonPrice : 0}
                        min={0}
                        type='number'
                        name='currentLessonPrice'
                        onChange={this.onChange}
                        disabled
                    />
                </div>
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
                        { (isAuthenticated && isTeacher && currentLessonForTeacher && currentTeacher && (currentLessonForTeacher.authorId === currentTeacher.id)) ?
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
                                <br />
                                <Button
                                    onClick={this.onGetSatExercises}
                                    style={{
                                        backgroundColor: 'gold',
                                        color: 'grey',
                                        border: 'none'
                                    }}
                                    className='mt-2'>
                                    Get Exercises
                                </Button>
                                { satsOpened ?
                                    (allSats.length > 0) ?
                                        <div>
                                            <h4>-- SAT Questions --</h4>
                                            <ol>
                                                { allSats.map(s => {
                                                    const rightAnswerIndex = s.rightAnswerIndex;

                                                    if (deletedQuestionIds.includes(s.id)) {
                                                        return(
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
                                                                    { s.question }
                                                                </span>
                                                            </p>
                                                        );
                                                    }

                                                    return(
                                                        <li key={s.id}>
                                                            <p style={{
                                                                fontStyle: 'italic'
                                                            }}>{s.question}</p>
                                                            <ul>
                                                                { s.answers.map((a, i) => {

                                                                    let liStyles = {};
                                                                    if (rightAnswerIndex == i) {
                                                                        liStyles = {
                                                                            textDecoration: 'underline',
                                                                            textDecorationColor: 'green',
                                                                            padding: '0.3em'
                                                                        };
                                                                    }

                                                                    return(
                                                                        <li key={i}
                                                                            style={ liStyles }
                                                                            className='mb-1'>
                                                                            <span
                                                                                className='mb-1 mr-2'>
                                                                                { a }
                                                                            </span>
                                                                        </li>
                                                                    );
                                                                }) }
                                                            </ul>
                                                            <p
                                                                style={{
                                                                    fontStyle: 'italic',
                                                                    color: 'red'
                                                                }}>Delete this question:
                                                                <Button
                                                                    onClick={ () => this.onDeleteQuestion(s.id) }
                                                                    style={{
                                                                        color: 'red',
                                                                        fontWeight: 'bold',
                                                                        border: '1px solid grey',
                                                                        backgroundColor: 'white',
                                                                        fontSize: '80%'
                                                                    }}
                                                                    className='ml-1'>
                                                                    X
                                                                </Button>
                                                            </p>
                                                        </li>
                                                    );
                                                }) }
                                            </ol>
                                        </div>
                                    : <p style={{ color: 'info' }}>No SATs for this lesson!</p>
                                : null
                                }
                                { satsOpened ?
                                    <FormGroup style={{
                                        border: '1px solid grey',
                                        borderRadius: '2%',
                                        padding: '2%',
                                        width: '40vw'
                                    }}>
                                        <h2>Add Single Answer Test Question</h2>
                                        <Input
                                            type='text'
                                            name='currentSatQuestion'
                                            placeholder='Add question...'
                                            value={currentSatQuestion}
                                            onChange={this.onChange}
                                            className='mb-1'
                                            style={{width: '30vw'}} />
                                        <br />
                                        <Input
                                            type='text'
                                            name='currentSatAnswer'
                                            placeholder='Add some answer to question...'
                                            value={currentSatAnswer}
                                            onChange={this.onChange}
                                            className='mb-1 mr-1'
                                            style={{width: '30vw', display: 'inline'}} />
                                        <Button
                                            size='sm'
                                            color='primary'
                                            outline
                                            onClick={this.addSatExerciseAnswer}>
                                                +
                                        </Button>
                                        <br />
                                        { currentSatAllAnswers.length > 0 ?
                                            <ul style={{ listStyle: 'none' }}>
                                                { currentSatAllAnswers.map((a, index) => {
                                                    let styles = null;
                                                    if (index == currentSatRightAnswerIndex) {
                                                        styles = {
                                                            border: '1px solid green',
                                                            padding: '1%'
                                                        }
                                                    } else {
                                                        styles = {};
                                                    }
                
                                                    return(
                                                        <li key={index} style={styles}>
                                                            {a}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        : null
                                        }
                                        <FormGroup>
                                            <Label
                                                for='rightAnswerIndexId'
                                                style={{
                                                    display: 'block'
                                                }}>
                                                Right answer index
                                            </Label>
                                            <Input
                                                id='rightAnswerIndexId'
                                                type='number'
                                                name='currentSatRightAnswerIndex'
                                                placeholder='Right answer index (starting from 0)...'
                                                value={currentSatRightAnswerIndex}
                                                onChange={this.onChange}
                                                min={0}
                                                max={ (currentSatAllAnswers.length == 0) ? 0 : (currentSatAllAnswers.length - 1) }
                                                className='mb-1'
                                                style={{width: '30vw', display: 'inline'}} />
                                        </FormGroup>
                                        { addSatExerciseError ?
                                            <span style={{
                                                display: 'block',
                                                color: 'red',
                                                fontSize: '90%',
                                                fontStyle: 'italic'
                                            }}>{addSatExerciseError}</span> 
                                        : null
                                        }
                                        <Button
                                            size='sm'
                                            color='primary'
                                            outline
                                            onClick={this.addSatExerciseToAll}
                                            style={{
                                                display: 'block'
                                            }}>
                                                Add Exercise
                                        </Button>
                                        { (satExercisesAll.length > 0) ?
                                            <div>
                                                <h4>All SAT questions</h4>
                                                <ul>
                                                    {satExercisesAll.map((s, index) => {
                                                        return(
                                                            <li key={index} style={{
                                                                border: '1px solid grey',
                                                                padding: '2%'
                                                                }}
                                                                className='mb-1'>
                                                                <span
                                                                    style={{
                                                                        display: 'block',
                                                                        fontStyle: 'italic'
                                                                    }}>{s.question}
                                                                </span>
                                                                <ul>
                                                                    {s.answers.map((an, i) => {
                                                                        let styles2 = null;
                                                                        if (i == s.rightAnswerIndex) {
                                                                            styles2 = {
                                                                                border: '1px solid green',
                                                                                padding: '1%'
                                                                            }
                                                                        } else {
                                                                            styles2 = {};
                                                                        }
                                                                        return(
                                                                            <li key={i} style={styles2}>
                                                                                {an}
                                                                            </li>
                                                                        );
                                                                    })}
                                                                </ul>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        : null }
                                    </FormGroup>
                                : null
                                }
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
    allLessonOngoings: PropTypes.array.isRequired,
    getSATExercisesByLessonId: PropTypes.func.isRequired,
    allSats: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
    isAuthenticated: state.auth.isAuthenticated,
    isTeacher: state.auth.isTeacher,
    currentLessonForTeacher: state.lesson.currentLessonForTeacher,
    currentTeacher: state.auth.teacher,
    allLessonOngoings: state.lessonOngoing.allLessonOngoings,
    allSats: state.exercise.allSATExercisesForCurrentLesson
});

export default connect(mapStateToProps, {
    loadLocalToken,
    loadUser,
    getLessonForTeacherById,
    updateLesson,
    createLessonOngoing,
    getSATExercisesByLessonId
})(LessonTeacherView);