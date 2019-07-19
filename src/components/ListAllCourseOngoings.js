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

class ListAllCourseOngoings extends Component {

    componentDidMount() {
        this.props.getCourseOngoings();
    }

    render() {
        const {
            deleteCourseOngoing,
            allCourseOngoings
        } = this.props;

        return(
            <Container>
                <h2>All ongoing courses</h2>
                <Row style={{ textAlign: 'center' }}>
                    <Col xs='4'>
                        ID
                    </Col>
                    <Col xs='4'>
                        COURSE ID
                    </Col>
                    <Col xs='2'>
                        DELETE
                    </Col>
                </Row>
                <ul>
                    { allCourseOngoings.map(c => {
                        return(
                            <li key={c.id}>
                                <Row>
                                    <Col xs='4'>
                                        { c.id }
                                    </Col>
                                    <Col xs='4'>
                                        { c.courseId }
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
    allCourseOngoings: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
    allCourseOngoings: state.courseOngoing.allCourseOngoings
});

export default connect(mapStateToProps, {
    deleteCourseOngoing,
    getCourseOngoings
})(ListAllCourseOngoings);