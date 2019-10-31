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

import { createLessonOngoing, getLessonOngoings } from '../actions/lessonOngoingActions';

class ListAllLessons extends Component {

    componentDidMount() {
        if (!this.props.isTeacher) {
            this.props.getLessonOngoings();
        }
    }

    componentDidUpdate() {
        if (!this.props.isTeacher && this.state.onCreatingLessonOngoing && (this.props.allLessonOngoings.length > this.state.lessonOngoingCount)) {
            const {
                allLessonOngoings
            } = this.props;

            const mapped = allLessonOngoings.map(l => {
                return l.lessonId;
            });

            this.setState({
                lessonOngoingCount: allLessonOngoings.length,
                addLessonOngoingStatus: 'New lesson ongoing added!',
                onCreatingLessonOngoing: false,
                lessonOngoingsIds: mapped
            });
        } else if (!this.props.isTeacher && (this.props.allLessonOngoings.length > this.state.lessonOngoingCount)) {
            const {
                allLessonOngoings
            } = this.props;

            const mapped = allLessonOngoings.map(l => {
                return l.lessonId;
            });
            
            this.setState({
                lessonOngoingsIds: mapped,
                lessonOngoingCount: allLessonOngoings.length
            });
        }
    }

    state = {
        lessonOngoingCount: -1,
        addLessonOngoingStatus: '',
        lessonOngoingsIds: [],
        onCreatingLessonOngoing: false
    }
    
    onCreateLessonOngoing = (lessonId) => {
        const data = {
            lessonId
        }

        this.setState({
            onCreatingLessonOngoing: true
        });
        this.props.createLessonOngoing(data);
    }

    render() {
        const {
            allLessons,
            isTeacher,
            error,
            toggleLessonForNewCourse
        } = this.props;

        const {
            lessonOngoingsIds
        } = this.state;

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

                        let enrollBtnStyle = {};
                        if (lessonOngoingsIds && lessonOngoingsIds.includes(l.id)) {
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
                                                style={ enrollBtnStyle }
                                                onClick={ () => { this.onCreateLessonOngoing(l.id) } }>
                                                    { (lessonOngoingsIds && lessonOngoingsIds.includes(l.id)) ? 'Enrolled' : 'Enroll' }
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
    toggleLessonForNewCourse: PropTypes.func,
    getLessonOngoings: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
    allLessonOngoings: state.lessonOngoing.allLessonOngoings
});

export default connect(mapStateToProps, {
    createLessonOngoing,
    getLessonOngoings
})(ListAllLessons);