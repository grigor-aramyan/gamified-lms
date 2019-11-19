import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Container,
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    Button
} from 'reactstrap';

import {
    getLessonByLessonOngoingId,
    updateLessonOngoingByLearningLearner
} from '../actions/lessonOngoingActions';
import { loadLocalToken, loadUser } from '../actions/authActions';
import { getSATExercisesByLessonId } from '../actions/exerciseActions';
import { getAQExercisesByLessonId } from '../actions/audioExerciseActions';

// Statics
import GET_LESSON_BY_LESSON_ONGOING_ID_ERROR from '../actions/lessonOngoingActions';

import Header from './Header';
import NotAuthenticated from './NotAuthenticated';

class LessonView extends Component {
    componentDidMount() {
        this.props.loadLocalToken();
        this.props.loadUser();
    }

    componentDidUpdate() {
        if ((this.props.currentLesson == null)
            && this.props.isAuthenticated
            && !this.props.isTeacher
            && this.state.currentLessonOngoingId == null) {
            const href = window.location.href;
            const parts = href.split('/');
            const lessonOngoingId = parts[parts.length - 1];
            this.setState({
                currentLessonOngoingId: lessonOngoingId
            });
            this.props.getLessonByLessonOngoingId(lessonOngoingId);
        }
    }

    state = {
        imagesActiveIndex: 0,
        imagesAnimating: false,
        videosActiveIndex: 0,
        videosAnimating: false,
        satsVisible: false,
        satsWithSingleAttempt: [],
        satsWithSecondAttempt: [],
        satsWithThirdAttempt: [],
        // item: satId:::answerIndex
        satAnswers: [],
        lessonSubmitError: '',
        currentLessonOngoingId: null,

        aqsVisible: false,
        aqsWithSingleAttempt: [],
        aqsWithSecondAttempt: [],
        aqsWithThirdAttempt: [],
        // item: satId:::answerIndex
        aqAnswers: []
    }

    onLessonSubmit = () => {
        if (((this.props.allSatsForLesson.length == 0) && (this.props.allAqsForLesson.length == 0)) ||
            (this.props.allSatsForLesson.length > this.state.satAnswers.length) ||
            (this.props.allAqsForLesson.length > this.state.aqAnswers.length)) {
            this.setState({
                lessonSubmitError: 'Should get and answer all exercises before submitting!'
            });
        } else {
            const {
                allSatsForLesson,
                allAqsForLesson,
                updateLessonOngoingByLearningLearner
            } = this.props;

            const {
                satsWithSingleAttempt,
                satsWithSecondAttempt,
                satsWithThirdAttempt,
                satAnswers,

                aqsWithSingleAttempt,
                aqsWithSecondAttempt,
                aqsWithThirdAttempt,
                aqAnswers,

                currentLessonOngoingId
            } = this.state;

            const totalPoints = satAnswers.reduce((acc, answer) => {
                const satId = answer.split(':::')[0];
                const answerIndex = answer.split(':::')[1];

                const currentSatData = allSatsForLesson.filter(sat => {
                    return(sat.id == satId);
                })[0];
                if (answerIndex != currentSatData.rightAnswerIndex) {
                    return acc;
                } else if ((answerIndex == currentSatData.rightAnswerIndex) &&
                    (satsWithSingleAttempt.includes(satId))) {
                    return (acc + 3);
                } else if ((answerIndex == currentSatData.rightAnswerIndex) &&
                    (satsWithSecondAttempt.includes(satId))) {
                    return (acc + 2);
                } else if ((answerIndex == currentSatData.rightAnswerIndex) &&
                    (satsWithThirdAttempt.includes(satId))) {
                    return (acc + 1);
                } else {
                    return acc;
                }
            }, 0);

            const totalAudioPoints = aqAnswers.reduce((acc, answer) => {
                const satId = answer.split(':::')[0];
                const answerIndex = answer.split(':::')[1];

                const currentSatData = allAqsForLesson.filter(sat => {
                    return(sat.id == satId);
                })[0];
                if (answerIndex != currentSatData.rightAnswerIndex) {
                    return acc;
                } else if ((answerIndex == currentSatData.rightAnswerIndex) &&
                    (aqsWithSingleAttempt.includes(satId))) {
                    return (acc + 3);
                } else if ((answerIndex == currentSatData.rightAnswerIndex) &&
                    (aqsWithSecondAttempt.includes(satId))) {
                    return (acc + 2);
                } else if ((answerIndex == currentSatData.rightAnswerIndex) &&
                    (aqsWithThirdAttempt.includes(satId))) {
                    return (acc + 1);
                } else {
                    return acc;
                }
            }, 0);

            const body = {
                completed: true,
                completionPoint: totalPoints + totalAudioPoints
            };

            updateLessonOngoingByLearningLearner(currentLessonOngoingId, body);
            this.setState({
                lessonSubmitError: ''
            });
        }
    }

    onSelectSatAnswer = (satId, answerIndex) => {
        const {
            satsWithSingleAttempt,
            satsWithSecondAttempt,
            satsWithThirdAttempt,
            satAnswers
        } = this.state;

        if (satsWithSingleAttempt.includes(satId)) {
            const updatedSatsWithSingleAttempt = satsWithSingleAttempt.filter(s => {
                return(s !== satId);
            });

            const dumbData = satsWithSecondAttempt;
            dumbData.unshift(satId);

            const filteredAnswers = satAnswers.filter(a => {
                return(a.split(':::')[0] != satId);
            });
            filteredAnswers.unshift(satId + ':::' + answerIndex);

            this.setState({
                satsWithSingleAttempt: updatedSatsWithSingleAttempt,
                satsWithSecondAttempt: dumbData,
                satAnswers: filteredAnswers
            });
        } else if(satsWithSecondAttempt.includes(satId)) {
            const updatedSatsWithSecondAttempt = satsWithSecondAttempt.filter(s => {
                return(s !== satId);
            });

            const dumbData = satsWithThirdAttempt;
            dumbData.unshift(satId);

            const filteredAnswers = satAnswers.filter(a => {
                return(a.split(':::')[0] !== satId);
            });
            filteredAnswers.unshift(satId + ':::' + answerIndex);

            this.setState({
                satsWithSecondAttempt: updatedSatsWithSecondAttempt,
                satsWithThirdAttempt: dumbData,
                satAnswers: filteredAnswers
            });
        } else if(satsWithThirdAttempt.includes(satId)) {
            
        } else {
            const dumbData = satsWithSingleAttempt;
            dumbData.unshift(satId);

            const filteredAnswers = satAnswers.filter(a => {
                return(a.split(':::')[0] !== satId);
            });
            filteredAnswers.unshift(satId + ':::' + answerIndex);

            this.setState({
                satsWithSingleAttempt: dumbData,
                satAnswers: filteredAnswers
            });
        }
    }

    onSelectAqAnswer = (satId, answerIndex) => {
        const {
            aqsWithSingleAttempt,
            aqsWithSecondAttempt,
            aqsWithThirdAttempt,
            aqAnswers
        } = this.state;

        if (aqsWithSingleAttempt.includes(satId)) {
            const updatedSatsWithSingleAttempt = aqsWithSingleAttempt.filter(s => {
                return(s !== satId);
            });

            const dumbData = aqsWithSecondAttempt;
            dumbData.unshift(satId);

            const filteredAnswers = aqAnswers.filter(a => {
                return(a.split(':::')[0] != satId);
            });
            filteredAnswers.unshift(satId + ':::' + answerIndex);

            this.setState({
                aqsWithSingleAttempt: updatedSatsWithSingleAttempt,
                aqsWithSecondAttempt: dumbData,
                aqAnswers: filteredAnswers
            });
        } else if(aqsWithSecondAttempt.includes(satId)) {
            const updatedSatsWithSecondAttempt = aqsWithSecondAttempt.filter(s => {
                return(s !== satId);
            });

            const dumbData = aqsWithThirdAttempt;
            dumbData.unshift(satId);

            const filteredAnswers = aqAnswers.filter(a => {
                return(a.split(':::')[0] !== satId);
            });
            filteredAnswers.unshift(satId + ':::' + answerIndex);

            this.setState({
                aqsWithSecondAttempt: updatedSatsWithSecondAttempt,
                aqsWithThirdAttempt: dumbData,
                aqAnswers: filteredAnswers
            });
        } else if(aqsWithThirdAttempt.includes(satId)) {
            
        } else {
            const dumbData = aqsWithSingleAttempt;
            dumbData.unshift(satId);

            const filteredAnswers = aqAnswers.filter(a => {
                return(a.split(':::')[0] !== satId);
            });
            filteredAnswers.unshift(satId + ':::' + answerIndex);

            this.setState({
                aqsWithSingleAttempt: dumbData,
                aqAnswers: filteredAnswers
            });
        }
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
            currentLesson
        } = this.props;

        if (this.state.imagesAnimating) return;
        const nextIndex = this.state.imagesActiveIndex === currentLesson.imageUris.length - 1 ? 0 : this.state.imagesActiveIndex + 1;
        this.setState({ imagesActiveIndex: nextIndex });
    }
    
    previousImage = () => {
        const {
            currentLesson
        } = this.props;

        if (this.state.imagesAnimating) return;
        const nextIndex = this.state.imagesActiveIndex === 0 ? currentLesson.imageUris.length - 1 : this.state.imagesActiveIndex - 1;
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
            currentLesson
        } = this.props;

        if (this.state.videosAnimating) return;
        const nextIndex = this.state.videosActiveIndex === currentLesson.videoUris.length - 1 ? 0 : this.state.videosActiveIndex + 1;
        this.setState({ videosActiveIndex: nextIndex });
    }
    
    previousVideo = () => {
        const {
            currentLesson
        } = this.props;

        if (this.state.videosAnimating) return;
        const nextIndex = this.state.videosActiveIndex === 0 ? currentLesson.videoUris.length - 1 : this.state.videosActiveIndex - 1;
        this.setState({ videosActiveIndex: nextIndex });
    }
    
    goToVideoIndex = (newIndex) => {
        if (this.state.videosAnimating) return;
        this.setState({ videosActiveIndex: newIndex });
    }

    onGetSatsForCurrentLesson = () => {
        if(!this.props.gettingSats) {
            this.props.getSATExercisesByLessonId(this.props.currentLesson.id);
            this.setState({
                satsVisible: true
            });
        }
    }

    onGetAqsForCurrentLesson = () => {
        if(!this.props.gettingAqs) {
            this.props.getAQExercisesByLessonId(this.props.currentLesson.id);
            this.setState({
                aqsVisible: true
            });
        }
    }

    onGetExercisesForCurrentLesson = () => {

        if(!this.props.gettingSats) {
            this.props.getSATExercisesByLessonId(this.props.currentLesson.id);
            this.setState({
                satsVisible: true
            });
        }

        if(!this.props.gettingAqs) {
            this.props.getAQExercisesByLessonId(this.props.currentLesson.id);
            this.setState({
                aqsVisible: true
            });
        }
    }

    render() {
        const {
            isAuthenticated,
            isTeacher,
            currentLesson,
            error,
            allSatsForLesson,
            allAqsForLesson
        } = this.props;

        let imageHrefs = [];
        let videoHrefs = [];
        if (currentLesson) {
            imageHrefs = currentLesson.imageUris;
            videoHrefs = currentLesson.videoUris;
        }

        const {
            imagesActiveIndex,
            videosActiveIndex,
            satsVisible,
            satAnswers,
            aqsVisible,
            aqAnswers
        } = this.state;

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
                { isAuthenticated && !isTeacher ?
                    <Container>
                        { currentLesson ?
                            <div>
                                <h2
                                    style={{
                                        textAlign: 'center'
                                    }}>
                                    {currentLesson.title}
                                </h2>
                                <p 
                                    style={{
                                        fontStyle: 'italic',
                                        textAlign: 'center'
                                    }}
                                    className='mb-2'>
                                    {currentLesson.description}
                                </p>
                                { videos.length > 0 ?
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
                                <p
                                    style={{
                                        border: '1px solid grey',
                                        borderRadius: '5%',
                                        padding: '10%'
                                    }}>
                                    {currentLesson.content}
                                </p>
                                { images.length > 0 ?
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
                                <Button
                                    onClick={this.onGetExercisesForCurrentLesson}
                                    className='btn btn-info'>
                                    Get Exercises
                                </Button>
                                { (allSatsForLesson && satsVisible) ?
                                    <div
                                        style={{
                                            border: '1px solid grey',
                                            borderRadius: '2%',
                                            padding: '2%',
                                            width: '40vw'
                                        }}
                                        className='mt-1'>
                                        <h4>SAT Questions</h4>
                                        { allSatsForLesson.length > 0 ?
                                            <ol>
                                                { allSatsForLesson.map((s, index) => {
                                                    const rightAnswerIndex = s.rightAnswerIndex;
                                                    const selectedAnswer = satAnswers.filter(a => {
                                                        return(a.split(':::')[0] == s.id);
                                                    });
                                                    let selectedAnswerIndex = null;
                                                    if (selectedAnswer.length > 0) {
                                                        selectedAnswerIndex = selectedAnswer[0].split(':::')[1];
                                                    }

                                                    const inputName = `answer-${s.id}`;

                                                    return(
                                                        <li key={index}>
                                                            <p style={{
                                                                fontStyle: 'italic'
                                                            }}>{s.question}</p>
                                                            <ul style={{ listStyle: 'none' }}>
                                                                {s.answers.map((a, i) => {
                                                                    let styles = null;
                                                                    if ((rightAnswerIndex == i) &&
                                                                        (selectedAnswerIndex == i)) {
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
                                                                                onClick={() => {this.onSelectSatAnswer(s.id, i)}}
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
                                { (allAqsForLesson && aqsVisible) ?
                                    <div
                                        style={{
                                            border: '1px solid grey',
                                            borderRadius: '2%',
                                            padding: '2%',
                                            width: '40vw'
                                        }}
                                        className='mt-1'>
                                        <h4>Audio Questions</h4>
                                        { allAqsForLesson.length > 0 ?
                                            <ol>
                                                { allAqsForLesson.map((s, index) => {
                                                    const rightAnswerIndex = s.rightAnswerIndex;
                                                    const selectedAnswer = aqAnswers.filter(a => {
                                                        return(a.split(':::')[0] == s.id);
                                                    });
                                                    let selectedAnswerIndex = null;
                                                    if (selectedAnswer.length > 0) {
                                                        selectedAnswerIndex = selectedAnswer[0].split(':::')[1];
                                                    }

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
                                                                    if ((rightAnswerIndex == i) &&
                                                                        (selectedAnswerIndex == i)) {
                                                                        styles = {
                                                                            backgroundColor: 'green',
                                                                            padding: '2%',
                                                                            display: 'inline'
                                                                        }
                                                                    } else if ((rightAnswerIndex != i) &&
                                                                        (selectedAnswerIndex == i)) {
                                                                            styles = {
                                                                                backgroundColor: 'red',
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
                                                                            <a
                                                                                onClick={() => {this.onSelectAqAnswer(s.id, i)}}
                                                                                href='javascript:void(0)'>
                                                                                { a.startsWith('http') ?
                                                                                    <img src={a} style={{
                                                                                        width: '50px',
                                                                                        height: 'auto'
                                                                                    }} />
                                                                                : <span
                                                                                    style={{
                                                                                        width: '50px',
                                                                                        height: 'auto',
                                                                                        border: '2px solid lightgrey',
                                                                                        borderRadius: '10%',
                                                                                        padding: '0.2em 0.5em'
                                                                                    }}>{a}</span>
                                                                                }
                                                                            </a>
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
                                <hr />
                                { this.state.lessonSubmitError ?
                                    <span style={{
                                        display: 'block',
                                        color: 'red',
                                        fontSize: '90%',
                                        fontStyle: 'italic'
                                    }}>{this.state.lessonSubmitError}</span>
                                : null
                                }
                                <Button
                                    style={{
                                        border: 'none',
                                        backgroundColor: 'gold',
                                        color: 'grey'
                                    }}
                                    onClick={this.onLessonSubmit}
                                    className='btn btn-primary mb-2'>
                                    Submit
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

LessonView.propTypes = {
    error: PropTypes.object,
    isAuthenticated: PropTypes.bool,
    isTeacher: PropTypes.bool.isRequired,
    getLessonByLessonOngoingId: PropTypes.func.isRequired,
    loadLocalToken: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired,
    currentLesson: PropTypes.object,
    getSATExercisesByLessonId: PropTypes.func.isRequired,
    allSatsForLesson: PropTypes.array.isRequired,
    gettingSats: PropTypes.bool.isRequired,
    updateLessonOngoingByLearningLearner: PropTypes.func.isRequired,
    gettingAqs: PropTypes.bool.isRequired,
    getAQExercisesByLessonId: PropTypes.func.isRequired,
    allAqsForLesson: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => ({
    error: state.error,
    isAuthenticated: state.auth.isAuthenticated,
    isTeacher: state.auth.isTeacher,
    currentLesson: state.lessonOngoing.lessonForSelectedOngoing,
    allSatsForLesson: state.exercise.allSATExercisesForCurrentLesson,
    gettingSats: state.exercise.gettingSATExercises,
    gettingAqs: state.audioExercise.gettingAQExercises,
    allAqsForLesson: state.audioExercise.allAQExercisesForCurrentLesson
});

export default connect(mapStateToProps, {
    updateLessonOngoingByLearningLearner,
    getSATExercisesByLessonId,
    getLessonByLessonOngoingId,
    loadLocalToken,
    loadUser,
    getAQExercisesByLessonId
})(LessonView);