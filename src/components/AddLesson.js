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
                addLessonError: ''
            });
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
        allLessonsCount: 0
    }

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
            imageUrls
        } = this.state;

        if (!(title && description && content)) {
            this.setState({ addLessonError: 'Title, description and content required!' });
        } else if (price < 0) {
            this.setState({ addLessonError: 'Price can\'t be less then 0' });
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

        if (currentImageUrl && currentImageUrl.startsWith('http://') && currentImageUrl.includes('.')) {
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
                && currentVideoUrl.startsWith('https://www.youtube.com')
                && currentVideoUrl.includes('.')) {
            let data = videoUrls;
            data.unshift(currentVideoUrl);

            this.setState({
                currentVideoUrl: '',
                videoUrls: data
            });
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
            imageUrls
        } = this.state;

        return(
            <Container>
                <h2>New Lesson</h2>
                <Form>
                    <Input
                        type='text'
                        name='title'
                        placeholder='Lesson title'
                        value={this.state.title}
                        onChange={this.onChange}
                        className='mb-1' />
                    <Input
                        type='text'
                        name='description'
                        placeholder='Lesson description'
                        value={this.state.description}
                        onChange={this.onChange}
                        className='mb-1' />
                    <Input
                        type='textarea'
                        name='content'
                        placeholder='Lesson content'
                        value={this.state.content}
                        onChange={this.onChange}
                        className='mb-1' />
                    <FormGroup>
                        <Label for='lesson-price'>Lesson price</Label>
                        <Input
                            id='lesson-price'
                            type='number'
                            name='price'
                            value={this.state.price}
                            onChange={this.onChange}
                            className='mb-1' />
                    </FormGroup>
                    <FormGroup>
                        <Input
                            type='url'
                            name='currentVideoUrl'
                            placeholder='Add video url...'
                            value={this.state.currentVideoUrl}
                            onChange={this.onChange}
                            className='mb-1 mr-1'
                            style={{width: '30vw', display: 'inline'}} />
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
                            <ul id='video-urls'>
                                {videoUrls.map(url => {
                                    return(<li>{url}</li>);
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
                            className='mb-1 mr-1'
                            style={{width: '30vw', display: 'inline'}} />
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
                            <ul id='image-urls'>
                                {imageUrls.map(url => {
                                    return(<li>{url}</li>);
                                })}
                            </ul>
                        </FormGroup>
                    : null }
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
                    <Button onClick={this.onAddLesson}>Add lesson</Button>
                </Form>
            </Container>
        );
    }
}

AddLesson.propTypes = {
    error: PropTypes.object.isRequired,
    createLesson: PropTypes.func.isRequired,
    allLessonsCount: PropTypes.number.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
});

export default connect(mapStateToProps, { createLesson })(AddLesson);