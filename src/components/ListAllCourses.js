import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Container,
    Col,
    Row
} from 'reactstrap';

import { getCourses } from '../actions/courseActions';

class ListAllCourses extends Component {
    componentDidMount() {
        this.props.getCourses();
    }

    render() {
        const {
            allCourses
        } = this.props;

        return(
            <Container>
                <h2>All courses</h2>
                <Row style={{ textAlign: 'center' }}>
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
                <ul>
                    { allCourses.map(c => {
                        return(
                            <li key={c.id}>
                                <Row style={{
                                    border: '2px solid orange',
                                    marginBottom: '2px',
                                    borderRadius: '10%'
                                    }}>
                                    <Col xs='3'>
                                        { c.title }
                                    </Col>
                                    <Col xs='6'>
                                        { c.description }
                                    </Col>
                                    <Col xs='1'>
                                        ${ c.price ? c.price : '0' }
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

ListAllCourses.propTypes = {
    error: PropTypes.object.isRequired,
    getCourses: PropTypes.func.isRequired,
    allCourses: PropTypes.array.isRequired,
    isTeacher: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
    allCourses: state.course.allCourses
});

export default connect(mapStateToProps, {
    getCourses
})(ListAllCourses);