import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Container,
    Button,
    FormGroup,
    Input,
    Label,
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators
} from 'reactstrap';

import { loadLocalToken, loadUser } from '../actions/authActions';
import { getLessonForTeacherById, updateLesson } from '../actions/lessonActions';
import { createLessonOngoing, getLessonOngoings } from '../actions/lessonOngoingActions';
import { getSATExercisesByLessonId, updateLessonSatBase } from '../actions/exerciseActions';
import { getAQExercisesByLessonId, updateLessonAqBase } from '../actions/audioExerciseActions';

import Header from './Header';
import NotAuthenticated from './NotAuthenticated';
import AddAudioExercise from './AddAudioExercise';

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

        const {
            isAuthenticated,
            isTeacher,
            allLessonOngoings,
            getLessonOngoings
        } = this.props;

        const {
            onCreatingLessonOngoing,
            allLessonOngoingsCount,
            ongoingsInitialFetch
        } = this.state;

        if (isAuthenticated && !isTeacher && !ongoingsInitialFetch) {
            this.setState({
                ongoingsInitialFetch: true
            });
            getLessonOngoings();
        }

        if (isAuthenticated && !isTeacher && onCreatingLessonOngoing && (allLessonOngoingsCount < allLessonOngoings.length)) {
            this.setState({
                onCreatingLessonOngoing: false
            });
            
            window.open('/lesson_ongoings', '_self');
        } else if (isAuthenticated && !isTeacher && (allLessonOngoingsCount < allLessonOngoings.length)) {
            const mapped = allLessonOngoings.map(l => {
                return l.lessonId;
            });

            this.setState({
                lessonOngoingsIds: mapped,
                allLessonOngoingsCount: allLessonOngoings.length
            });
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
        allLessonOngoingsCount: -1,
        satsOpened: false,
        deletedQuestionIds: [],
        currentSatQuestion: '',
        currentSatAnswer: '',
        currentSatAllAnswers: [],
        addSatExerciseError: '',
        currentSatRightAnswerIndex: 0,
        satExercisesAll: [],
        saveExerciseChangesError: '',
        satUpdateStatus: '',
        lessonOngoingsIds: [],
        onCreatingLessonOngoing: false,
        ongoingsInitialFetch: false,
        imagesActiveIndex: 0,
        imagesAnimating: false,
        videosActiveIndex: 0,
        videosAnimating: false,
        satsVisible: false,

        aqsOpened: false,
        deletedAudioQuestionIds: [],
        currentAqQuestion: '',
        currentAqAllAnswers: [],
        addAqExerciseError: '',
        currentAqRightAnswerIndex: 0,
        aqExercisesAll: [],
        aqUpdateStatus: '',
        aqsVisible: false,
        saveAudioExerciseChangesError: ''
    }

    onExitingImages = () => {
        this.setState({
            imagesAnimating: true
        });
    }
    
    onExitedImages = () => {
        this.setState({
            imagesAnimating: false
        });
    }
    
    nextImage = () => {
        const {
            currentLessonForTeacher
        } = this.props;

        if (this.state.imagesAnimating) return;
        const nextIndex = this.state.imagesActiveIndex === currentLessonForTeacher.imageUris.length - 1 ? 0 : this.state.imagesActiveIndex + 1;
        this.setState({ imagesActiveIndex: nextIndex });
    }
    
    previousImage = () => {
        const {
            currentLessonForTeacher
        } = this.props;

        if (this.state.imagesAnimating) return;
        const nextIndex = this.state.imagesActiveIndex === 0 ? currentLessonForTeacher.imageUris.length - 1 : this.state.imagesActiveIndex - 1;
        this.setState({ imagesActiveIndex: nextIndex });
    }
    
    goToImagesIndex = (newIndex) => {
        if (this.state.imagesAnimating) return;
        this.setState({ imagesActiveIndex: newIndex });
    }

    /////////////////////////
    onExitingVideos = () => {
        this.setState({
            videosAnimating: true
        });
    }
    
    onExitedVideos = () => {
        this.setState({
            videosAnimating: false
        });
    }
    
    nextVideo = () => {
        const {
            currentLessonForTeacher
        } = this.props;

        if (this.state.videosAnimating) return;
        const nextIndex = this.state.videosActiveIndex === currentLessonForTeacher.videoUris.length - 1 ? 0 : this.state.videosActiveIndex + 1;
        this.setState({ videosActiveIndex: nextIndex });
    }
    
    previousVideo = () => {
        const {
            currentLessonForTeacher
        } = this.props;

        if (this.state.videosAnimating) return;
        const nextIndex = this.state.videosActiveIndex === 0 ? currentLessonForTeacher.videoUris.length - 1 : this.state.videosActiveIndex - 1;
        this.setState({ videosActiveIndex: nextIndex });
    }
    
    goToVideoIndex = (newIndex) => {
        if (this.state.videosAnimating) return;
        this.setState({ videosActiveIndex: newIndex });
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

        this.setState({
            onCreatingLessonOngoing: true
        });
        this.props.createLessonOngoing(body);
    }

    onGetSatExercises = () => {
        this.props.getSATExercisesByLessonId(this.state.currentLessonId);
        this.setState({
            satsOpened: true
        });
    }

    onGetSatsForCurrentLesson = () => {
        
        if(!this.props.gettingSats) {
            this.props.getSATExercisesByLessonId(this.props.currentLessonForTeacher.id);
            this.setState({
                satsVisible: true
            });
        }
    }

    onGetExercisesForCurrentLessonForGuestTeacher = () => {
        if(!this.props.gettingSats) {
            this.props.getSATExercisesByLessonId(this.props.currentLessonForTeacher.id);
            this.setState({
                satsVisible: true
            });
        }

        if(!this.props.gettingAqs) {
            this.props.getAQExercisesByLessonId(this.props.currentLessonForTeacher.id);
            this.setState({
                aqsVisible: true
            });
        }
    }

    onGetExercisesForCurrentLesson = () => {
        
        this.props.getSATExercisesByLessonId(this.state.currentLessonId);
        this.setState({
            satsOpened: true
        });
        
        this.props.getAQExercisesByLessonId(this.props.currentLessonForTeacher.id);
        this.setState({
            aqsOpened: true
        });
    }

    // ****************** AQs methods start ***********************



    onChooseAqRightAnswerIndex = (index) => {
        this.setState({
            currentAqRightAnswerIndex: index
        });
    }
    
    onAddCurrentAqQuestion = (qUrl) => {
        this.setState({
            currentAqQuestion: qUrl
        });
    }

    onAddAqExerciseError = (errorMsg) => {
        this.setState({
            addAqExerciseError: errorMsg
        });
    }

    onGetAqsForCurrentLesson = () => {
        
        if(!this.props.gettingAqs) {
            this.props.getAQExercisesByLessonId(this.props.currentLessonForTeacher.id);
            this.setState({
                aqsVisible: true
            });
        }
    }

    onDeleteAudioQuestion = (questionId) => {
        let intermediateList = this.state.deletedAudioQuestionIds;
        intermediateList.push(questionId);
        this.setState({
            deletedAudioQuestionIds: intermediateList
        });
    }

    addAqExerciseAnswer = (imageUri) => {

        if (imageUri) {
            let answers = this.state.currentAqAllAnswers;
            answers.unshift(imageUri);
            this.setState({
                currentAqAllAnswers: answers,
                addAqExerciseError: ''
            });
        } else {
            this.setState({
                addAqExerciseError: 'AQ can\'t have empty answer'
            });
        }
    }

    addAqExerciseToAll = () => {
        const {
            currentAqQuestion,
            currentAqAllAnswers,
            currentAqRightAnswerIndex
        } = this.state;

        if (!currentAqQuestion) {
            this.setState({
                addAqExerciseError: 'Audio question required!'
            });
        } else if (currentAqAllAnswers.length < 2) {
            this.setState({
                addAqExerciseError: 'All AQ questions should have at least 2 answers!'
            });
        } else {
            const o = {
                audioQuestion: currentAqQuestion,
                answerImages: currentAqAllAnswers,
                rightAnswerIndex: currentAqRightAnswerIndex
            }

            let allAqs = this.state.aqExercisesAll;
            allAqs.unshift(o);

            this.setState({
                aqExercisesAll: allAqs,
                currentAqQuestion: '',
                currentAqAllAnswers: [],
                currentAqRightAnswerIndex: 0,
                addAqExerciseError: ''
            });
        }
    }

    onUpdateLessonAudioExercises = () => {
        const {
            aqExercisesAll,
            deletedAudioQuestionIds,
            currentLessonId
        } = this.state;

        if ((aqExercisesAll.length > 0) || (deletedAudioQuestionIds.length > 0)) {
            const exercises = aqExercisesAll.map(s => {
                return({
                    ...s,
                    lessonId: currentLessonId
                });
            });

            this.props.updateLessonAqBase(deletedAudioQuestionIds, exercises);
            this.setState({
                aqUpdateStatus: '*** Exercises updated!',
                aqExercisesAll: [],
                deletedAudioQuestionIds: []
            });
        } else {
            this.setState({
                aqUpdateStatus: ''
            });
        }
    }

    // ***************** AQs methods end **************************

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

    onUpdateLessonExercises = () => {
        const {
            satExercisesAll,
            deletedQuestionIds,
            currentLessonId
        } = this.state;

        if ((satExercisesAll.length > 0) || (deletedQuestionIds.length > 0)) {
            const exercises = satExercisesAll.map(s => {
                return({
                    ...s,
                    lessonId: currentLessonId
                });
            });

            this.props.updateLessonSatBase(deletedQuestionIds, exercises);
            this.setState({
                satUpdateStatus: '*** Exercises updated!',
                satExercisesAll: [],
                deletedQuestionIds: []
            });
        } else {
            this.setState({
                satUpdateStatus: ''
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
            allSats,
            allAqs
        } = this.props;

        const {
            imagesActiveIndex,
            videosActiveIndex,
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
            satExercisesAll,
            saveExerciseChangesError,
            satUpdateStatus,
            lessonOngoingsIds,
            satsVisible,

            aqsOpened,
            deletedAudioQuestionIds,
            currentAqQuestion,
            currentAqAllAnswers,
            currentAqRightAnswerIndex,
            addAqExerciseError,
            aqExercisesAll,
            aqsVisible,
            aqUpdateStatus,
            saveAudioExerciseChangesError
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

        let enrollBtnStyle = {};
        if (lessonOngoingsIds && currentLessonForTeacher && lessonOngoingsIds.includes(currentLessonForTeacher.id)) {
            enrollBtnStyle = {
                backgroundColor: 'lime',
                border: 'none',
                padding: '1em 3em',
                pointerEvents: 'none'
            };
        } else {
            enrollBtnStyle = {
                backgroundColor: 'deepskyblue',
                border: 'none',
                padding: '1em 3em'
            };
        }

        let imageHrefs = [];
        let videoHrefs = [];
        if (currentLessonForTeacher) {
            imageHrefs = currentLessonForTeacher.imageUris;
            videoHrefs = currentLessonForTeacher.videoUris;
        }

        const images = imageHrefs.map((i, index) => {
            return(
                <CarouselItem
                    onExiting={this.onExitingImages}
                    onExited={this.onExitedImages}
                    key={index}
                    >
                    <img
                        src={i}
                        width="560"
                        height="315"
                        />
                </CarouselItem>
            );
        });

        const videos = videoHrefs.map((v, index) => {
            return(
                <CarouselItem
                    onExiting={this.onExitingVideos}
                    onExited={this.onExitedVideos}
                    key={index}
                    >
                    <iframe
                        className='lesson-video-iframe-sizes'
                        src={v}
                        frameBorder="0"
                        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                    </iframe>
                </CarouselItem>
            );
        });

        return(
            <div>
                <Header />
                { isAuthenticated ?
                    <Container>
                        { titleInput }
                        { descInput }
                        { (isTeacher && (videos.length > 0)) ?
                            <Carousel
                                activeIndex={videosActiveIndex}
                                className='mb-2'
                                >
                                <CarouselIndicators items={videos} activeIndex={videosActiveIndex} onClickHandler={this.goToVideoIndex} />
                                {videos}
                                <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previousVideo} />
                                <CarouselControl direction="next" directionText="Next" onClickHandler={this.nextVideo} />
                            </Carousel>
                        : null
                        }
                        { contentInput }
                        { priceInput }
                        { (isTeacher && (images.length > 0)) ?
                            <Carousel
                                activeIndex={imagesActiveIndex}
                                next={this.nextImage}
                                previous={this.previousImage}
                                className='mt-2 mb-2'
                                >
                                <CarouselIndicators items={images} activeIndex={imagesActiveIndex} onClickHandler={this.goToImagesIndex} />
                                {images}
                                <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previousImage} />
                                <CarouselControl direction="next" directionText="Next" onClickHandler={this.nextImage} />
                            </Carousel>
                        : null
                        }
                        { (isAuthenticated && !isTeacher) ?
                            <div>
                                <hr />
                                <div
                                    className='enroll-btn-centered'>
                                    <Button
                                        onClick={this.onEnroll}
                                        style={ enrollBtnStyle }
                                        className='mr-2 mt-2'>
                                        { (lessonOngoingsIds && currentLessonForTeacher && lessonOngoingsIds.includes(currentLessonForTeacher.id)) ? 'Enrolled' : 'Enroll' }
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
                                    onClick={this.onGetExercisesForCurrentLesson}
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
                                                <h4>Added SAT questions</h4>
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
                                { satsOpened ?
                                    <div
                                        className='mb-2'>
                                        { saveExerciseChangesError ?
                                            <p
                                                style={{
                                                    color: 'red',
                                                    fontStyle: 'italic'
                                                }}>{ saveExerciseChangesError }</p>
                                        : null
                                        }
                                        { satUpdateStatus ?
                                            <p
                                                style={{
                                                    color: 'green'
                                                }}>
                                                { satUpdateStatus }
                                            </p>
                                        : null
                                        }
                                        <Button
                                            style={{
                                                backgroundColor: 'lime',
                                                color: 'white',
                                                border: 'none'
                                            }}
                                            onClick={ this.onUpdateLessonExercises }>
                                            Save Exercise Changes
                                        </Button>
                                    </div>
                                : null
                                }
                                { aqsOpened ?
                                    (allAqs.length > 0) ?
                                        <div>
                                            <h4>-- Audio Questions --</h4>
                                            <ol>
                                                { allAqs.map(s => {
                                                    const rightAnswerIndex = s.rightAnswerIndex;

                                                    if (deletedAudioQuestionIds.includes(s.id)) {
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
                                                                    { s.id }
                                                                </span>
                                                            </p>
                                                        );
                                                    }

                                                    return(
                                                        <li key={s.id}>
                                                            <audio
                                                                src={ s.audioQuestion }
                                                                controls
                                                                style={{ verticalAlign: 'middle' }}>
                                                            </audio>
                                                            <ul
                                                                style={{
                                                                    marginLeft: '0px'
                                                                }}
                                                                className='mt-2 mb-3'>
                                                                { s.answerImages.map((a, i) => {

                                                                    let liStyles = {};
                                                                    if (rightAnswerIndex == i) {
                                                                        liStyles = {
                                                                            backgroundColor: 'green',
                                                                            padding: '2%',
                                                                            display: 'inline'
                                                                        };
                                                                    } else {
                                                                        liStyles = {
                                                                            padding: '1%',
                                                                            display: 'inline'
                                                                        };
                                                                    }

                                                                    return(
                                                                        <li key={i}
                                                                            style={ liStyles }
                                                                            className='mr-1'>
                                                                            <img src={a} style={{
                                                                                width: '50px',
                                                                                height: 'auto'
                                                                            }} />
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
                                                                    onClick={ () => this.onDeleteAudioQuestion(s.id) }
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
                                    : <p style={{ color: 'info' }}>No AQs for this lesson!</p>
                                : null
                                }
                                { aqsOpened ?
                                    <AddAudioExercise
                                        aqExercisesAll = { aqExercisesAll }
                                        currentAqQuestion = { currentAqQuestion }
                                        currentAqAllAnswers = { currentAqAllAnswers }
                                        currentAqRightAnswerIndex = { currentAqRightAnswerIndex }
                                        addAqExerciseError = { addAqExerciseError }
                                        addAqExerciseToAll = { this.addAqExerciseToAll }
                                        addAqExerciseAnswer = { this.addAqExerciseAnswer }
                                        onAddCurrentAqQuestion = { this.onAddCurrentAqQuestion }
                                        onAddAqExerciseError = { this.onAddAqExerciseError }
                                        onChooseAqRightAnswerIndex = { this.onChooseAqRightAnswerIndex } />
                                : null
                                }
                                { aqsOpened ?
                                    <div
                                        className='mb-2'>
                                        { saveAudioExerciseChangesError ?
                                            <p
                                                style={{
                                                    color: 'red',
                                                    fontStyle: 'italic'
                                                }}>{ saveAudioExerciseChangesError }</p>
                                        : null
                                        }
                                        { aqUpdateStatus ?
                                            <p
                                                style={{
                                                    color: 'green'
                                                }}>
                                                { aqUpdateStatus }
                                            </p>
                                        : null
                                        }
                                        <Button
                                            style={{
                                                backgroundColor: 'lime',
                                                color: 'white',
                                                border: 'none'
                                            }}
                                            onClick={ this.onUpdateLessonAudioExercises }>
                                            Save Audio Exercise Changes
                                        </Button>
                                    </div>
                                : null
                                }
                            </div>
                        : null
                        }
                        { (isAuthenticated && isTeacher && currentLessonForTeacher && currentTeacher && (currentLessonForTeacher.authorId !== currentTeacher.id)) ?
                            <div>
                                <Button
                                    onClick={this.onGetExercisesForCurrentLessonForGuestTeacher}
                                    className='btn btn-info mb-2'>
                                    Get Exercises
                                </Button>
                                { (allSats && satsVisible && currentLessonForTeacher && currentTeacher) ?
                                    <div
                                        style={{
                                            border: '1px solid grey',
                                            borderRadius: '2%',
                                            padding: '2%',
                                            width: '40vw'
                                        }}
                                        className='mt-1 mb-2'>
                                        <h4>SAT Questions</h4>
                                        { allSats.length > 0 ?
                                            <ol>
                                                { allSats.map((s, index) => {
                                                    const rightAnswerIndex = s.rightAnswerIndex;
                                                    
                                                    const inputName = `answer-${s.id}`;

                                                    return(
                                                        <li key={index}>
                                                            <p style={{
                                                                fontStyle: 'italic'
                                                            }}>{s.question}</p>
                                                            <ul style={{ listStyle: 'none' }}>
                                                                {s.answers.map((a, i) => {
                                                                    let styles = null;
                                                                    if (rightAnswerIndex == i) {
                                                                        styles = {
                                                                            border: '1px solid green',
                                                                            padding: '1%'
                                                                        }
                                                                    } else {
                                                                        styles = {}
                                                                    }
                                                                    
                                                                    return(
                                                                        <li key={i} style={styles} className='mb-1'>
                                                                            <input
                                                                                type='radio'
                                                                                name={inputName}
                                                                                id='sat-answer'
                                                                                value={i}
                                                                                className='mr-1'
                                                                                //onClick={() => {this.onSelectSatAnswer(s.id, i)}}
                                                                                />
                                                                            <label
                                                                                htmlFor='sat-answer'>
                                                                                {a}
                                                                            </label>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                            <hr />
                                                        </li>
                                                    );
                                                })}
                                            </ol>
                                        : <span style={{ fontStyle: 'italic' }}>
                                            No SAT questions for this lesson!
                                        </span>
                                        }
                                    </div>
                                : null
                                }
                                { (allAqs && aqsVisible && currentLessonForTeacher && currentTeacher) ?
                                    <div
                                        style={{
                                            border: '1px solid grey',
                                            borderRadius: '2%',
                                            padding: '2%',
                                            width: '40vw'
                                        }}
                                        className='mt-1 mb-2'>
                                        <h4>Audio Questions</h4>
                                        { allAqs.length > 0 ?
                                            <ol>
                                                { allAqs.map((s, index) => {
                                                    const rightAnswerIndex = s.rightAnswerIndex;

                                                    return(
                                                        <li key={index}>
                                                            <audio
                                                                src={ s.audioQuestion }
                                                                controls
                                                                style={{ verticalAlign: 'middle' }}>
                                                            </audio>
                                                            <ul style={{ listStyle: 'none' }}>
                                                                {s.answerImages.map((a, i) => {
                                                                    let styles = null;
                                                                    if (rightAnswerIndex == i) {
                                                                        styles = {
                                                                            backgroundColor: 'green',
                                                                            padding: '2%',
                                                                            display: 'inline'
                                                                        }
                                                                    } else {
                                                                        styles = {
                                                                            padding: '1%',
                                                                            display: 'inline'
                                                                        }
                                                                    }
                                                                    
                                                                    return(
                                                                        <li key={i} style={styles} className='mr-1'>
                                                                            <img src={a} style={{
                                                                                width: '50px',
                                                                                height: 'auto'
                                                                            }} />
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                            <hr />
                                                        </li>
                                                    );
                                                })}
                                            </ol>
                                        : <span style={{ fontStyle: 'italic' }}>
                                            No audio questions for this lesson!
                                        </span>
                                        }
                                    </div>
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
    allSats: PropTypes.array.isRequired,
    updateLessonSatBase: PropTypes.func.isRequired,
    getLessonOngoings: PropTypes.func.isRequired,
    gettingSats: PropTypes.bool.isRequired,
    getAQExercisesByLessonId: PropTypes.func.isRequired,
    allAqs: PropTypes.array.isRequired,
    gettingAqs: PropTypes.bool.isRequired,
    updateLessonAqBase: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
    isAuthenticated: state.auth.isAuthenticated,
    isTeacher: state.auth.isTeacher,
    currentLessonForTeacher: state.lesson.currentLessonForTeacher,
    currentTeacher: state.auth.teacher,
    allLessonOngoings: state.lessonOngoing.allLessonOngoings,
    allSats: state.exercise.allSATExercisesForCurrentLesson,
    gettingSats: state.exercise.gettingSATExercises,
    allAqs: state.audioExercise.allAQExercisesForCurrentLesson,
    gettingAqs: state.audioExercise.gettingAQExercises
});

export default connect(mapStateToProps, {
    loadLocalToken,
    loadUser,
    getLessonForTeacherById,
    updateLesson,
    createLessonOngoing,
    getSATExercisesByLessonId,
    updateLessonSatBase,
    getLessonOngoings,
    getAQExercisesByLessonId,
    updateLessonAqBase
})(LessonTeacherView);