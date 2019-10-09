import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Container,
    Button,
    Row,
    Col,
    Card,
    CardImg,
    CardText,
    CardBody,
    CardTitle
} from 'reactstrap';

import {
    getLessonOngoings,
    deleteLessonOngoing
} from '../actions/lessonOngoingActions';
import {
    getExtendedLessonsById
} from '../actions/lessonActions';

class ListAllLessonOngoings extends Component {
    
    componentDidMount() {
        this.props.getLessonOngoings();
    }

    componentDidUpdate() {
        if ((this.props.allLessonOngoings.length > 0)
            && !this.props.lessonsExtended
            && !this.props.fetchingExtendedLessons) {
            const lessonsIds = this.props.allLessonOngoings.map(lo => {
                return lo.lessonId;
            });
            this.props.getExtendedLessonsById({ lessonsIds });
        }
    }
    
    render() {
        const {
            deleteLessonOngoing,
            allLessonOngoings,
            lessonsExtended
        } = this.props;

        return(
            <Container>
                <h2>-- My ongoing lessons --</h2>
                <Row>
                    { allLessonOngoings.map(l => {
                        let lessonExtended = null;
                        if (lessonsExtended) {
                            lessonExtended = lessonsExtended.filter(le => {
                                return (le.id.toString() === l.lessonId.toString());
                            })[0];
                        }

                        let avatarSrc = '';
                        if (lessonExtended && (lessonExtended.imageUris.length > 0)) {
                            avatarSrc = lessonExtended.imageUris[0];
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
                                        <CardTitle><a href={`/lesson_ongoings/lesson/${l.id}`}>{ lessonExtended ? lessonExtended.title : '' }</a></CardTitle>
                                        <span
                                            style={{
                                                fontStyle: 'italic',
                                                fontSize: '90%',
                                                display: 'block',
                                                color: 'gray',
                                                textDecoration: 'underline'
                                            }}>
                                            Author
                                        </span>
                                        <CardText>{ lessonExtended ? lessonExtended.authorName : '' }</CardText>
                                        <span
                                            style={{
                                                fontStyle: 'italic',
                                                fontSize: '90%',
                                                display: 'block',
                                                color: 'gray',
                                                textDecoration: 'underline'
                                            }}>
                                            Author Subject
                                        </span>
                                        <CardText>{ lessonExtended ? lessonExtended.authorSubject : '' }</CardText>
                                        <span
                                            style={{
                                                fontStyle: 'italic',
                                                fontSize: '90%',
                                                display: 'block',
                                                color: 'gray',
                                                textDecoration: 'underline'
                                            }}>
                                            Delete
                                        </span>
                                        <Button 
                                            onClick={ () => { deleteLessonOngoing(l.id) } }
                                            style={{
                                                border: '1px solid grey',
                                                backgroundColor: 'rgba(0,0,0,0)',
                                                color: 'red'
                                            }}>
                                            X
                                        </Button>
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

ListAllLessonOngoings.propTypes = {
    error: PropTypes.object.isRequired,
    allLessonOngoings: PropTypes.array.isRequired,
    getLessonOngoings: PropTypes.func.isRequired,
    deleteLessonOngoing: PropTypes.func.isRequired,
    getExtendedLessonsById: PropTypes.func.isRequired,
    lessonsExtended: PropTypes.array,
    fetchingExtendedLessons: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
    allLessonOngoings: state.lessonOngoing.allLessonOngoings,
    lessonsExtended: state.lesson.extendedLessonsByIds,
    fetchingExtendedLessons: state.lesson.fetchingExtendedLessons
});

export default connect(mapStateToProps, {
   getLessonOngoings,
   deleteLessonOngoing,
   getExtendedLessonsById
})(ListAllLessonOngoings);