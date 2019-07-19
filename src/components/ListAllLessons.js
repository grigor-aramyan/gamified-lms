import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Container,
    Button,
    Input,
    Col,
    Row
} from 'reactstrap';

import { createLessonOngoing } from '../actions/lessonOngoingActions';

class ListAllLessons extends Component {

    state = {
        lessonOngoingCount: 0,
        addLessonOngoingStatus: ''
    }

    componentDidMount() {
        if (!this.props.isTeacher) {
            this.setState({ lessonOngoingCount: this.props.allLessonOngoings.length });
        }
    }

    componentDidUpdate() {
        if (!this.props.isTeacher && (this.props.allLessonOngoings.length > this.state.lessonOngoingCount)) {
            this.setState({
                lessonOngoingCount: this.props.allLessonOngoings.length,
                addLessonOngoingStatus: 'New lesson ongoing added!'
            });
        }
    }
    
    onCreateLessonOngoing = (lessonId) => {
        const data = {
            lessonId
        }

        this.props.createLessonOngoing(data);
    }

    render() {
        const {
            allLessons,
            isTeacher,
            error,
            toggleLessonForNewCourse
        } = this.props;

        return(
            <Container>
                <h2>All Lessons</h2>
                { (!isTeacher && this.state.addLessonOngoingStatus !== '') ?
                    <p style={{ color: 'green' }}>{ this.state.addLessonOngoingStatus }</p>
                    : null
                }
                <ul >
                    { allLessons.map(l => {
                        return(
                            <li key={l.id} style={{ border: '1px solid orange'}} className='mb-1 pl-1'>
                                <Row>
                                    <Col xs='3'>{l.title}</Col>
                                    <Col xs='6'>{l.description}</Col>
                                    { l.price ? <Col xs='1'>${l.price}</Col> : null }
                                    { !isTeacher ?
                                        <Col xs='2' offset='10'>
                                            <Button
                                                onClick={ () => { this.onCreateLessonOngoing(l.id) } }>
                                                    Enroll
                                            </Button>
                                        </Col> : null
                                    }
                                    { isTeacher ?
                                        <Col xs='2' offset='10'>
                                            <Input
                                                type='checkbox'
                                                onClick={ () => { toggleLessonForNewCourse(l.id) } } />
                                        </Col>
                                        : null
                                    }
                                </Row>
                            </li>
                        );
                    }) }
                </ul>
            </Container>
        );
    }
}

ListAllLessons.propTypes = {
    error: PropTypes.object.isRequired,
    allLessons: PropTypes.array,
    isTeacher: PropTypes.bool.isRequired,
    createLessonOngoing: PropTypes.func.isRequired,
    allLessonOngoings: PropTypes.array.isRequired,
    toggleLessonForNewCourse: PropTypes.func
}

const mapStateToProps = (state) => ({
    error: state.error,
    allLessonOngoings: state.lessonOngoing.allLessonOngoings
});

export default connect(mapStateToProps, {
    createLessonOngoing
})(ListAllLessons);