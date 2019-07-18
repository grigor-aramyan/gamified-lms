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
    state = {
        title: '',
        description: '',
        content: '',
        price: 0,
        addLessonError: ''
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onAddLesson = () => {
        const {
            title,
            description,
            content,
            price
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
                price
            };

            this.props.createLesson(newLesson);
            this.setState({ addLessonError: '' });
        }
    }

    render() {
        const { error } = this.props;

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
    createLesson: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error
});

export default connect(mapStateToProps, { createLesson })(AddLesson);