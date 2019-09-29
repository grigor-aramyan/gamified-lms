import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Container,
    Button,
    Col,
    Row
} from 'reactstrap';

import { getCourses } from '../actions/courseActions';
import { createCourseOngoing } from '../actions/courseOngoingActions';

class ListAllCourses extends Component {
    componentDidMount() {
        this.props.getCourses();

        this.setState({ courseOngoingsCount: this.props.allCourseOngoings.length });
    }

    componentDidUpdate() {
        if (this.state.courseOngoingsCount < this.props.allCourseOngoings.length) {
            this.setState({
                courseOngoingsCount: this.props.allCourseOngoings.length,
                addCourseOngoingStatus: 'Enrolled'
            });
        }
    }

    state = {
        courseOngoingsCount: 0,
        addCourseOngoingStatus: ''
    }

    render() {
        const {
            allCourses,
            isTeacher,
            createCourseOngoing
        } = this.props;

        return(
            <Container>
                <h2>-- All courses --</h2>
                { (!isTeacher && this.state.addCourseOngoingStatus !== '') ?
                    <p style={{ color: 'green' }}>{ this.state.addCourseOngoingStatus }</p>
                    : null
                }
                <Row
                    style={{
                        border: '2px solid gold',
                        borderRadius: '10%',
                        padding: '4px',
                        fontStyle: 'italic',
                        textAlign: 'center'
                    }}
                    className='mb-2'>
                    <Col xs='3'>
                        TITLE
                    </Col>
                    <Col xs='6'>
                        DESCRIPTION
                    </Col>
                    <Col xs='1'>
                        PRICE
                    </Col>
                </Row>
                <ul style={{
                    listStyleType: 'none'
                }}>
                    { allCourses.map(c => {
                        return(
                            <li key={c.id}
                                style={{
                                    border: '2px solid deepskyblue',
                                    borderRadius: '10%',
                                    padding: '4px'
                                }} 
                                className='mb-1 pl-1'>
                                <Row>
                                    <Col xs='3'>
                                        <a href={ `/courses/${c.id}` }>{ c.title }</a>
                                    </Col>
                                    <Col xs='6'>
                                        { c.description }
                                    </Col>
                                    <Col xs='1'>
                                        ${ c.price ? c.price : '0' }
                                    </Col>
                                    { !isTeacher ?
                                        <Col xs='2'>
                                            <Button
                                                style={{
                                                    backgroundColor: 'gold',
                                                    color: 'grey',
                                                    border: 'none'
                                                }}
                                                onClick={ () => { createCourseOngoing({ courseId: c.id }) } }>
                                                Enroll
                                            </Button>
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

ListAllCourses.propTypes = {
    error: PropTypes.object.isRequired,
    getCourses: PropTypes.func.isRequired,
    allCourses: PropTypes.array.isRequired,
    isTeacher: PropTypes.bool.isRequired,
    createCourseOngoing: PropTypes.func.isRequired,
    allCourseOngoings: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
    allCourses: state.course.allCourses,
    allCourseOngoings: state.courseOngoing.allCourseOngoings
});

export default connect(mapStateToProps, {
    getCourses,
    createCourseOngoing
})(ListAllCourses);