import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Form,
    Input,
    Button,
    Container,
    FormGroup,
    Label
} from 'reactstrap';

import { createLesson, CREATE_LESSON_ERROR } from '../actions/lessonActions';
import { createManySATExercises } from '../actions/exerciseActions';
import { createManyAQExercises } from '../actions/audioExerciseActions';
import AddAudioExercise from './AddAudioExercise';

class AddLesson extends Component {
    componentDidMount() {
        if (this.props.allLessonsCount > 0) {
            this.setState({
                allLessonsCount: this.props.allLessonsCount
            });
        }
    }

    componentDidUpdate() {
        if (this.props.allLessonsCount > this.state.allLessonsCount) {
            this.setState({
                allLessonsCount: this.props.allLessonsCount,
                title: '',
                description: '',
                content: '',
                price: 0,
                currentVideoUrl: '',
                currentImageUrl: '',
                videoUrls: [],
                imageUrls: [],
                addLessonError: '',
                initialLastLesson: this.props.lastLesson
            });

            const lastLessonId = this.props.lastLesson.id;
            if (this.state.satExercisesAll.length > 0) {
                const allSats = this.state.satExercisesAll;
                const allSatsFinished = allSats.map(s => {
                    return({
                        ...s,
                        lessonId: lastLessonId
                    });
                });

                this.props.createManySATExercises(allSatsFinished);
                this.setState({
                    satExercisesAll: [],
                    addSatExerciseError: '',
                    currentSatQuestion: '',
                    currentSatAnswer: '',
                    currentSatAllAnswers: [],
                    currentSatRightAnswerIndex: 0            
                });
            }

            if (this.state.aqExercisesAll.length > 0) {
                const allAqs = this.state.aqExercisesAll;
                const allAqsFinished = allAqs.map(s => {
                    return({
                        ...s,
                        lessonId: lastLessonId
                    });
                });

                this.props.createManyAQExercises(allAqsFinished);
                this.setState({
                    aqExercisesAll: [],
                    addAqExerciseError: '',
                    currentAqQuestion: '',
                    currentAqAnswer: '',
                    currentAqAllAnswers: [],
                    currentAqRightAnswerIndex: 0            
                });
            }
        }
    }

    state = {
        title: '',
        description: '',
        content: '',
        price: 0,
        currentVideoUrl: '',
        currentImageUrl: '',
        videoUrls: [],
        imageUrls: [],
        addLessonError: '',
        allLessonsCount: 0,
        satExercisesAll: [],
        addSatExerciseError: '',
        currentSatQuestion: '',
        currentSatAnswer: '',
        currentSatAllAnswers: [],
        currentSatRightAnswerIndex: 0,
        initialLastLesson: null,
        
        aqExercisesAll: [],
        currentAqQuestion: '',
        currentAqAnswer: '',
        currentAqAllAnswers: [],
        currentAqRightAnswerIndex: 0,
        addAqExerciseError: ''
    }

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

    // ************ AQ questions start **********************

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

    // ********************* AQ questions end *********************

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onAddLesson = () => {
        const {
            title,
            description,
            content,
            price,
            videoUrls,
            imageUrls,
            satExercisesAll,
            aqExercisesAll
        } = this.state;

        if (!(title && description && content)) {
            this.setState({ addLessonError: 'Title, description and content required!' });
        } else if (price < 0) {
            this.setState({ addLessonError: 'Price can\'t be less then 0' });
        } else if ((satExercisesAll.length == 0) && (aqExercisesAll.length == 0)) {
            this.setState({ addLessonError: 'All lessons should have at least 1 question!' });
        } else {
            const newLesson = {
                title,
                description,
                content,
                videoUrls,
                imageUrls,
                price
            };

            this.props.createLesson(newLesson);
            this.setState({
                addLessonError: '',
                currentImageUrl: '',
                currentVideoUrl: ''
            });
        }
    }

    addToImages = () => {
        const {
            currentImageUrl,
            imageUrls
        } = this.state;

        if (currentImageUrl && (currentImageUrl.startsWith('http://') || currentImageUrl.startsWith('https://')) && currentImageUrl.includes('.')) {
            let data = imageUrls;
            data.unshift(currentImageUrl);

            this.setState({
                currentImageUrl: '',
                imageUrls: data
            });
        } else {
            this.setState({
                addLessonError: 'Image Url looks weird. Check, please!'
            });
        }
    }

    addToVideos = () => {
        const {
            currentVideoUrl,
            videoUrls
        } = this.state;

        if (currentVideoUrl
                && (currentVideoUrl.startsWith('https://www.youtube.com')
                || currentVideoUrl.startsWith('https://youtu.be')
                || currentVideoUrl.startsWith('https://m.youtube.com'))) {
            let data = videoUrls;

            let processedUri = '';
            if (currentVideoUrl.startsWith('https://www.youtube.com') && currentVideoUrl.includes('embed/')) {
                processedUri = currentVideoUrl;

                data.unshift(processedUri);

                this.setState({
                    currentVideoUrl: '',
                    videoUrls: data
                });
            } else if (currentVideoUrl.startsWith('https://www.youtube.com') && currentVideoUrl.includes('watch?v=')) {
                const splitted = currentVideoUrl.split('watch?v=')[1];
                if (splitted.includes('&')) {
                    processedUri = `https://www.youtube.com/embed/${splitted.split('&')[0]}`;
                } else {
                    processedUri = currentVideoUrl.replace('watch?v=', 'embed/');
                }

                data.unshift(processedUri);

                this.setState({
                    currentVideoUrl: '',
                    videoUrls: data
                });
            } else if (currentVideoUrl.startsWith('https://youtu.be')) {
                processedUri = `https://www.youtube.com/embed/${currentVideoUrl.split('.be/')[1]}`;

                data.unshift(processedUri);

                this.setState({
                    currentVideoUrl: '',
                    videoUrls: data
                });
            } else if (currentVideoUrl.startsWith('https://m.youtube.com')) {
                processedUri = `https://www.youtube.com/embed/${currentVideoUrl.split('watch?v=')[1]}`;

                data.unshift(processedUri);

                this.setState({
                    currentVideoUrl: '',
                    videoUrls: data
                });
            } else {
                this.setState({
                    addLessonError: 'Video Url looks weird. Check, please!'
                });
            }

        } else {
            this.setState({
                addLessonError: 'Video Url looks weird. Check, please!'
            });
        }
    }

    render() {
        const { error } = this.props;

        const {
            videoUrls,
            imageUrls,
            currentSatQuestion,
            currentSatAnswer,
            currentSatRightAnswerIndex,
            currentSatAllAnswers,
            addSatExerciseError,
            satExercisesAll,
            aqExercisesAll,
            currentAqQuestion,
            currentAqAllAnswers,
            currentAqRightAnswerIndex,
            addAqExerciseError
        } = this.state;

        const inputsStyle = {
            width: '40vw'
        };

        const mainContentLeftMargin = '20vw';

        return(
            <Container>
                <h2
                    className='main-content-left-margin'>-- New Lesson --</h2>
                <Form>
                    <div
                        className='main-content-left-margin'>
                        <Input
                            type='text'
                            name='title'
                            placeholder='Lesson title'
                            value={this.state.title}
                            onChange={this.onChange}
                            className='mb-1 main-content-input' />
                        <Input
                            type='text'
                            name='description'
                            placeholder='Lesson description'
                            value={this.state.description}
                            onChange={this.onChange}
                            className='mb-1 main-content-input' />
                        <Input
                            type='textarea'
                            name='content'
                            placeholder='Lesson content'
                            value={this.state.content}
                            onChange={this.onChange}
                            className='mb-1 main-content-input' />
                        <FormGroup>
                            <Label for='lesson-price'>Lesson price</Label>
                            <Input
                                id='lesson-price'
                                type='number'
                                name='price'
                                value={this.state.price}
                                onChange={this.onChange}
                                className='mb-1 main-content-input' />
                        </FormGroup>
                        <FormGroup>
                            <Input
                                type='url'
                                name='currentVideoUrl'
                                placeholder='Add video url...'
                                value={this.state.currentVideoUrl}
                                onChange={this.onChange}
                                className='mb-1 mr-1 sat-input'
                                style={{display: 'inline'}} />
                            <Button
                                size='sm'
                                color='primary'
                                outline
                                onClick={this.addToVideos}>
                                    +
                                </Button>
                        </FormGroup>
                        { videoUrls.length > 0 ?
                            <FormGroup>
                                <Label for='video-urls'>Video Urls:</Label>
                                <ul
                                    style={{
                                        listStyleType: 'none'
                                    }}
                                    id='video-urls'>
                                    {videoUrls.map((url, index) => {
                                        return(
                                            <li
                                                key={index}
                                                style={{
                                                    borderBottom: '1px solid deepskyblue'
                                                }}>
                                                {url}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </FormGroup>
                        : null }
                        <FormGroup>
                            <Input
                                type='url'
                                name='currentImageUrl'
                                placeholder='Add image url...'
                                value={this.state.currentImageUrl}
                                onChange={this.onChange}
                                className='mb-1 mr-1 sat-input'
                                style={{display: 'inline'}} />
                            <Button
                                size='sm'
                                color='primary'
                                outline
                                onClick={this.addToImages}>
                                    +
                                </Button>
                        </FormGroup>
                        { imageUrls.length > 0 ?
                            <FormGroup>
                                <Label for='image-urls'>Image Urls:</Label>
                                <ul
                                    style={{
                                        listStyleType: 'none'
                                    }}
                                    id='image-urls'>
                                    {imageUrls.map((url, index) => {
                                        return(
                                            <li
                                                key={index}
                                                style={{
                                                    borderBottom: '1px solid deepskyblue'
                                                }}>
                                                {url}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </FormGroup>
                        : null }
                    </div>
                    <FormGroup style={{
                            border: '1px solid grey',
                            borderRadius: '2%',
                            padding: '2%'
                        }}
                        className='sat-container'>
                        <h2>Add Single Answer Test Question</h2>
                        <Input
                            type='text'
                            name='currentSatQuestion'
                            placeholder='Add question...'
                            value={currentSatQuestion}
                            onChange={this.onChange}
                            className='mb-1 sat-input' />
                        <br />
                        <Input
                            type='text'
                            name='currentSatAnswer'
                            placeholder='Add some answer to question...'
                            value={currentSatAnswer}
                            onChange={this.onChange}
                            className='mb-1 mr-1 sat-input'
                            style={{display: 'inline'}} />
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
                                className='mb-1  sat-input'
                                style={{display: 'inline'}} />
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
                    { this.state.addLessonError ?
                        <span style={{
                            display: 'block',
                            color: 'red',
                            fontSize: '90%',
                            fontStyle: 'italic'
                        }}>{this.state.addLessonError}</span> : null
                    }
                    { (error.id === CREATE_LESSON_ERROR) ?
                        <span style={{
                            display: 'block',
                            color: 'red',
                            fontSize: '90%',
                            fontStyle: 'italic'
                        }}>{error.msg.msg}</span> : null
                    }
                    <Button
                        style={{
                            backgroundColor: 'gold',
                            border: 'none',
                            color: 'grey'
                        }}
                        onClick={this.onAddLesson}>Add lesson</Button>
                </Form>
            </Container>
        );
    }
}

AddLesson.propTypes = {
    error: PropTypes.object.isRequired,
    createLesson: PropTypes.func.isRequired,
    allLessonsCount: PropTypes.number.isRequired,
    lastLesson: PropTypes.object,
    createManySATExercises: PropTypes.func.isRequired,
    createManyAQExercises: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
});

export default connect(mapStateToProps, {
    createLesson,
    createManySATExercises,
    createManyAQExercises
})(AddLesson);