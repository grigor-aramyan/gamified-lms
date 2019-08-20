import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Button,
    Container,
    Col,
    Row
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
                <h2>My ongoing courses</h2>
                <Row style={{ textAlign: 'center' }}>
                    <Col xs='4'>
                        TITLE
                    </Col>
                    <Col xs='4'>
                        LESSONS
                    </Col>
                    <Col xs='1'>
                        PRICE
                    </Col>
                    <Col xs='2'>
                        DELETE
                    </Col>
                </Row>
                <hr />
                <ul style={{ listStyle: 'none', marginLeft: '0px' }}>
                    { allCourseOngoings.map(c => {
                        let courseExtended = null;
                        if (coursesExtended) {
                            courseExtended = coursesExtended.filter(ce => {
                                return(ce.id.toString() === c.courseId.toString());
                            })[0];
                        }

                        return(
                            <li key={c.id}>
                                <Row>
                                    <Col xs='4'>
                                        <a href={`/course_ongoings/course/${c.id}`}>{ courseExtended ? courseExtended.title : '' }</a>
                                    </Col>
                                    <Col xs='4'>
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
                                    </Col>
                                    <Col xs='1'>
                                        { courseExtended ? `$${courseExtended.price}` : '' }
                                    </Col>
                                    <Col xs='2'>
                                        <Button 
                                            onClick={ () => { deleteCourseOngoing(c.id) } }
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