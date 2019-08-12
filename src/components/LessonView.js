import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Container,
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption,
    Button
} from 'reactstrap';

import { getLessonByLessonOngoingId } from '../actions/lessonOngoingActions';
import { loadLocalToken, loadUser } from '../actions/authActions';
import { getSATExercisesByLessonId } from '../actions/exerciseActions';

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
        if ((this.props.currentLesson == null) && this.props.isAuthenticated && !this.props.isTeacher) {
            const href = window.location.href;
            const parts = href.split('/');
            const lessonOngoingId = parts[parts.length - 1];
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
        satAnswers: []
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

    render() {
        const {
            isAuthenticated,
            isTeacher,
            currentLesson,
            error,
            allSatsForLesson
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
            satAnswers
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
                        width="560"
                        height="315"
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
                                        next={this.nextVideo}
                                        previous={this.previousVideo}
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
                                    onClick={this.onGetSatsForCurrentLesson}
                                    className='btn btn-info'>
                                    Get Exercises
                                </Button>
                                { (allSatsForLesson && satsVisible) ?
                                    <div>
                                        <h4>SAT Questions</h4>
                                        { allSatsForLesson.length > 0 ?
                                            <ul>
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
                                                            <p>{s.question}</p>
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
                                                                        styles = {};
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
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        : <span style={{ fontStyle: 'italic' }}>
                                            No SAT questions for this lesson!
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
    gettingSats: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
    isAuthenticated: state.auth.isAuthenticated,
    isTeacher: state.auth.isTeacher,
    currentLesson: state.lessonOngoing.lessonForSelectedOngoing,
    allSatsForLesson: state.exercise.allSATExercisesForCurrentLesson,
    gettingSats: state.exercise.gettingSATExercises
});

export default connect(mapStateToProps, {
    getSATExercisesByLessonId,
    getLessonByLessonOngoingId,
    loadLocalToken,
    loadUser
})(LessonView);