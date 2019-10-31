import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Container,
    Button,
    Col,
    Row,
    Card,
    CardImg,
    CardText,
    CardBody,
    CardTitle
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
                <Row>
                    { allCourses.map(c => {
                        return (
                            <Col key={c.id} xs={12} sm={6} md={4}>
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
                                        <CardTitle><a href={ `/courses/${c.id}` }>{ c.title }</a></CardTitle>
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
                                        <CardText>{ c.description }</CardText>
                                        <CardText>
                                            <span
                                                className='mr-1'
                                                style={{
                                                    color: 'gray',
                                                    textDecoration: 'underline',
                                                    fontSize: '90%',
                                                    fontStyle: 'italic'
                                                }}>Price</span>
                                            { c.price ? '$' + c.price : '$0' }
                                        </CardText>
                                        { !isTeacher ?
                                            <Button
                                                style={{
                                                    backgroundColor: 'deepskyblue',
                                                    //color: 'grey',
                                                    border: 'none',
                                                    padding: '1em 3em'
                                                }}
                                                onClick={ () => { createCourseOngoing({ courseId: c.id }) } }>
                                                Enroll
                                            </Button>
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