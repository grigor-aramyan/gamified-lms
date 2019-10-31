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
import { createCourseOngoing, getCourseOngoings } from '../actions/courseOngoingActions';

class ListAllCourses extends Component {
    componentDidMount() {
        this.props.getCourses();
        
        if (!this.props.isTeacher) {
            this.props.getCourseOngoings();
        }
    }

    componentDidUpdate() {
        if (!this.props.isTeacher && this.state.onCreatingCourseOngoing && (this.state.courseOngoingsCount < this.props.allCourseOngoings.length)) {
            const {
                allCourseOngoings
            } = this.props;

            const mapped = allCourseOngoings.map(c => {
                return c.courseId;
            });

            this.setState({
                courseOngoingsCount: this.props.allCourseOngoings.length,
                addCourseOngoingStatus: 'Enrolled',
                onCreatingLessonOngoing: false,
                courseOngoingsIds: mapped
            });
        } else if (!this.props.isTeacher && (this.state.courseOngoingsCount < this.props.allCourseOngoings.length)) {
            const {
                allCourseOngoings
            } = this.props;

            const mapped = allCourseOngoings.map(c => {
                return c.courseId;
            });
            
            this.setState({
                courseOngoingsIds: mapped,
                courseOngoingsCount: allCourseOngoings.length
            });
        }
    }

    state = {
        courseOngoingsCount: -1,
        addCourseOngoingStatus: '',
        courseOngoingsIds: [],
        onCreatingCourseOngoing: false
    }

    onCourseEnroll = (courseId) => {
        this.setState({
            onCreatingCourseOngoing: true
        });
        this.createCourseOngoing({ courseId });
    }

    render() {
        const {
            allCourses,
            isTeacher,
            createCourseOngoing
        } = this.props;

        const {
            courseOngoingsIds
        } = this.state;

        return(
            <Container>
                <h2>-- All courses --</h2>
                { (!isTeacher && this.state.addCourseOngoingStatus !== '') ?
                    <p style={{ color: 'green' }}>{ this.state.addCourseOngoingStatus }</p>
                    : null
                }
                <Row>
                    { allCourses.map(c => {
                        let enrollBtnStyle = {};
                        if (courseOngoingsIds && courseOngoingsIds.includes(c.id)) {
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
                                                style={ enrollBtnStyle }
                                                onClick={ () => { this.onCourseEnroll(c.id) } }>
                                                { (courseOngoingsIds && courseOngoingsIds.includes(c.id)) ? 'Enrolled' : 'Enroll' }
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
    allCourseOngoings: PropTypes.array.isRequired,
    getCourseOngoings: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
    allCourses: state.course.allCourses,
    allCourseOngoings: state.courseOngoing.allCourseOngoings
});

export default connect(mapStateToProps, {
    getCourses,
    createCourseOngoing,
    getCourseOngoings
})(ListAllCourses);