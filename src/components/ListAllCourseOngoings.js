import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Button,
    Container,
    Col,
    Row,
    Card,
    CardImg,
    CardText,
    CardBody,
    CardTitle
} from 'reactstrap';

import {
    deleteCourseOngoing,
    getCourseOngoings
} from '../actions/courseOngoingActions';

import {
    getExtendedCoursessById
} from '../actions/courseActions';

class ListAllCourseOngoings extends Component {

    componentDidMount() {
        this.props.getCourseOngoings();
    }

    componentDidUpdate() {
        if ((this.props.allCourseOngoings.length > 0)
            && !this.props.coursesExtended
            && !this.props.fetchingExtendedCourses) {
            const coursesIds = this.props.allCourseOngoings.map(co => {
                return co.courseId;
            });
            this.props.getExtendedCoursessById({ coursesIds });
        }
    }

    render() {
        const {
            deleteCourseOngoing,
            allCourseOngoings,
            coursesExtended
        } = this.props;

        return(
            <Container>
                <h2>-- My ongoing courses --</h2>
                <Row>
                    { allCourseOngoings.map(c => {
                        let courseExtended = null;
                        if (coursesExtended) {
                            courseExtended = coursesExtended.filter(ce => {
                                return(ce.id.toString() === c.courseId.toString());
                            })[0];
                        }

                        return (
                            <Col key={c.id} xs={4}>
                                <Card
                                    className='mb-2'>
                                    <CardImg top width='100%' src='/images/logo_clean_header_transparent.png' />
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
                                        <CardTitle><a href={`/course_ongoings/course/${c.id}`}>{ courseExtended ? courseExtended.title : '' }</a></CardTitle>
                                        <span
                                            style={{
                                                fontStyle: 'italic',
                                                fontSize: '90%',
                                                display: 'block',
                                                color: 'gray',
                                                textDecoration: 'underline'
                                            }}>
                                            Lessons
                                        </span>
                                        <ol>
                                            { courseExtended ?
                                                courseExtended.lessons.map(l => {
                                                    return(
                                                        <li key={l.id}>
                                                            {l.title}
                                                        </li>
                                                    );
                                                })
                                            : null
                                            }
                                        </ol>
                                        <CardText>
                                            <span
                                                className='mr-1'
                                                style={{
                                                    color: 'gray',
                                                    textDecoration: 'underline',
                                                    fontSize: '90%',
                                                    fontStyle: 'italic'
                                                }}>Price</span>
                                            { courseExtended ? `$${courseExtended.price}` : '' }
                                        </CardText>
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
                                            onClick={ () => { deleteCourseOngoing(c.id) } }
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

ListAllCourseOngoings.propTypes = {
    error: PropTypes.object.isRequired,
    deleteCourseOngoing: PropTypes.func.isRequired,
    getCourseOngoings: PropTypes.func.isRequired,
    allCourseOngoings: PropTypes.array.isRequired,
    getExtendedCoursessById: PropTypes.func.isRequired,
    coursesExtended: PropTypes.array,
    fetchingExtendedCourses: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
    allCourseOngoings: state.courseOngoing.allCourseOngoings,
    coursesExtended: state.course.extendedCoursesByIds,
    fetchingExtendedCourses: state.course.fetchingExtendedCourses
});

export default connect(mapStateToProps, {
    deleteCourseOngoing,
    getCourseOngoings,
    getExtendedCoursessById
})(ListAllCourseOngoings);