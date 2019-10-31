import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Container,
    Button,
    Input,
    Col,
    Row,
    Card,
    CardImg,
    CardText,
    CardBody,
    CardTitle
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
                <h2>-- All Lessons --</h2>
                { (!isTeacher && this.state.addLessonOngoingStatus !== '') ?
                    <p style={{ color: 'green' }}>{ this.state.addLessonOngoingStatus }</p>
                    : null
                }
                <Row>
                    { allLessons.map(l => {
                        let avatarSrc = '';
                        if (l.imageUris.length > 0) {
                            avatarSrc = l.imageUris[0];
                        } else {
                            avatarSrc = '/images/lesson_image_placeholder.png';
                        }

                        return (
                            <Col key={l.id} xs={12} sm={6} md={4}>
                                <Card
                                    className='mb-2'>
                                    <CardImg top width='100%' src={avatarSrc} />
                                    <CardBody
                                        style={{
                                            textAlign: 'center'
                                        }}>
                                        <span
                                            style={{
                                                fontStyle: 'italic',
                                                fontSize: '90%',
                                                display: 'block',
                                                color: 'gray',
                                                textDecoration: 'underline'
                                            }}>
                                            Title
                                        </span>
                                        <CardTitle><a href={`/lessons/${l.id}`}>{ l.title }</a></CardTitle>
                                        <span
                                            style={{
                                                fontStyle: 'italic',
                                                fontSize: '90%',
                                                display: 'block',
                                                color: 'gray',
                                                textDecoration: 'underline'
                                            }}>
                                            Description
                                        </span>
                                        <CardText>{ l.description }</CardText>
                                        <CardText>
                                            <span
                                                className='mr-1'
                                                style={{
                                                    color: 'gray',
                                                    textDecoration: 'underline',
                                                    fontSize: '90%',
                                                    fontStyle: 'italic'
                                                }}>Price</span>
                                            { l.price ? '$' + l.price : '$0' }
                                        </CardText>
                                        { !isTeacher ?
                                            <Button
                                                style={{
                                                    backgroundColor: 'deepskyblue',
                                                    //color: 'grey',
                                                    border: 'none',
                                                    padding: '1em 3em'
                                                }}
                                                onClick={ () => { this.onCreateLessonOngoing(l.id) } }>
                                                    Enroll
                                            </Button>
                                        : null
                                        }
                                        { isTeacher ?
                                            <div>
                                                <span
                                                    style={{
                                                        color: 'gray',
                                                        fontSize: '90%',
                                                        fontStyle: 'italic',
                                                        textDecoration: 'underline',
                                                        display: 'block'
                                                    }}>
                                                    Add to Course
                                                </span>
                                                <Input
                                                    type='checkbox'
                                                    onClick={ () => { toggleLessonForNewCourse(l.id) } } />
                                            </div>
                                        : null
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        );
                    }) }
                </Row>
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