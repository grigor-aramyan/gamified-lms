import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Form,
    Input,
    Button,
    Container,
    Col
} from 'reactstrap';

import { createCourse } from '../actions/courseActions';

// Constants
import { CREATE_COURSE_ERROR } from '../actions/courseActions';

class AddCourse extends Component {
    componentDidMount() {
        this.setState({ coursesCount: this.props.courses.length });
    }
    componentDidUpdate() {
        if (this.state.coursesCount < this.props.courses.length) {
            this.setState({
                coursesCount: this.props.courses.length,
                addCourseStatus: 'New course added!'
            });
        }
    }

    state = {
        title: '',
        description: '',
        price: 0,
        addCourseError: '',
        coursesCount: 0,
        addCourseStatus: ''
    }

    onCreateCourse = () => {
        const {
            isTeacher,
            learner,
            teacher,
            createCourse,
            lessonsForNewCourse
        } = this.props;

        let author = '';
        if (isTeacher) {
            author = teacher.id;
        } else {
            author = learner.id;
        }

        const {
            title,
            description,
            price
        } = this.state;

        if (!title || !description) {
            this.setState({ addCourseError: 'Title and description required' });
        } else if (price < 0) {
            this.setState({ addCourseError: 'Price can\'t be less than 0' });
        } else if (lessonsForNewCourse.length <= 0) {
            this.setState({ addCourseError: 'Course should contain at least 1 lesson' });
        } else {
            const body = {
                title,
                description,
                price,
                author,
                lessons: lessonsForNewCourse
            }

            createCourse(body);
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {

        const {
            error,
            lessonsForNewCourse
        } = this.props;

        return(
            <Container>
                <h2>Add Course</h2>
                <br />
                { (this.state.addCourseStatus !== '') ?
                    <p style={{ color: 'green' }}>{ this.state.addCourseStatus }</p>
                    : null
                }
                <Form>
                    <Input
                        type='text'
                        name='title'
                        placeholder='Title'
                        value={this.state.title}
                        onChange={this.onChange}
                        className='mb-1' />
                    <Input
                        type='text'
                        name='description'
                        placeholder='Description'
                        value={this.state.description}
                        onChange={this.onChange}
                        className='mb-1' />
                    <Input
                        type='number'
                        name='price'
                        value={this.state.price}
                        onChange={this.onChange}
                        className='mb-1' />
                    { this.state.addCourseError ?
                        <span style={{
                            display: 'block',
                            color: 'red',
                            fontSize: '90%',
                            fontStyle: 'italic'
                        }}>{this.state.addCourseError}</span> : null
                    }
                    { (error.id === CREATE_COURSE_ERROR) ?
                        <span style={{
                            display: 'block',
                            color: 'red',
                            fontSize: '90%',
                            fontStyle: 'italic'
                        }}>{error.msg.msg}</span> : null
                    }
                    <ul>
                        { lessonsForNewCourse.map(l => {
                            return(
                                <li key={l.id}>
                                    <Col xs='6' offset='5'>
                                        { l }
                                    </Col>
                                </li>
                            );
                        }) }
                    </ul>
                    <Button onClick={this.onCreateCourse}>Add course</Button>
                </Form>
            </Container>
        );
    }
}

AddCourse.propTypes = {
    error: PropTypes.object.isRequired,
    createCourse: PropTypes.func.isRequired,
    lessonsForNewCourse: PropTypes.array.isRequired,
    isTeacher: PropTypes.bool.isRequired,
    learner: PropTypes.object,
    teacher: PropTypes.object,
    courses: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
    isTeacher: state.auth.isTeacher,
    learner: state.auth.learner,
    teacher: state.auth.teacher,
    courses: state.course.allCourses
});

export default connect(mapStateToProps, {
    createCourse
})(AddCourse);