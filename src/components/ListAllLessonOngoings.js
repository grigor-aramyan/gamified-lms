import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Container,
    Button,
    Row,
    Col
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
                <Row
                    style={{
                        border: '2px solid gold',
                        borderRadius: '10%',
                        padding: '4px',
                        fontStyle: 'italic',
                        textAlign: 'center'
                    }}
                    className='mb-2'>
                    <Col xs='4'>
                        LESSON TITLE
                    </Col>
                    <Col xs='3' style={{ textAlign: 'center' }}>
                        AUTHOR
                    </Col>
                    <Col xs='2' style={{ textAlign: 'center' }}>
                        SUBJECT
                    </Col>
                    <Col xs='1'>
                        DELETE
                    </Col>
                </Row>
                <ul style={{ listStyle: 'none', marginLeft: '0px' }}>
                    { allLessonOngoings.map(l => {
                        let lessonExtended = null;
                        if (lessonsExtended) {
                            lessonExtended = lessonsExtended.filter(le => {
                                return (le.id.toString() === l.lessonId.toString());
                            })[0];
                        }

                        return(
                            <li key={l.id}
                                style={{
                                    border: '2px solid deepskyblue',
                                    borderRadius: '10%',
                                    padding: '4px'
                                }} 
                                className='mb-1 pl-1'>
                                <Row>
                                    <Col xs='4'>
                                        <a href={`/lesson_ongoings/lesson/${l.id}`}>{ lessonExtended ? lessonExtended.title : '' }</a>
                                    </Col>
                                    <Col xs='3' style={{ textAlign: 'center' }}>
                                        { lessonExtended ? lessonExtended.authorName : '' }
                                    </Col>
                                    <Col xs='2' style={{ textAlign: 'center' }}>
                                        { lessonExtended ? lessonExtended.authorSubject : '' }
                                    </Col>
                                    <Col xs='1'>
                                        <Button 
                                            onClick={ () => { deleteLessonOngoing(l.id) } }
                                            style={{
                                                border: '1px solid grey',
                                                backgroundColor: 'rgba(0,0,0,0)',
                                                color: 'red'
                                            }}>
                                            X
                                        </Button>
                                    </Col>          
                                </Row>
                            </li>
                        );
                    }) }
                </ul>
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