import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Container,
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption
} from 'reactstrap';

import { getLessonByLessonOngoingId } from '../actions/lessonOngoingActions';
import { loadLocalToken, loadUser } from '../actions/authActions';

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
        videosAnimating: false
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

    render() {
        const {
            isAuthenticated,
            isTeacher,
            currentLesson,
            error
        } = this.props;

        let imageHrefs = [];
        let videoHrefs = [];
        if (currentLesson) {
            imageHrefs = currentLesson.imageUris;
            videoHrefs = currentLesson.videoUris;
        }

        const {
            imagesActiveIndex,
            videosActiveIndex
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
    currentLesson: PropTypes.object
}

const mapStateToProps = (state) => ({
    error: state.error,
    isAuthenticated: state.auth.isAuthenticated,
    isTeacher: state.auth.isTeacher,
    currentLesson: state.lessonOngoing.lessonForSelectedOngoing
});

export default connect(mapStateToProps, {
    getLessonByLessonOngoingId,
    loadLocalToken,
    loadUser
})(LessonView);