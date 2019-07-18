import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Container,
    Button,
    Col,
    Row
} from 'reactstrap';

class ListAllLessons extends Component {
    render() {
        const {
            allLessons,
            isTeacher,
            error
        } = this.props;

        return(
            <Container>
                <h2>All Lessons</h2>
                <ul >
                    { allLessons.map(l => {
                        return(
                            <li key={l.id} style={{ border: '1px solid orange'}} className='mb-1 pl-1'>
                                <Row>
                                    <Col xs='3'>{l.title}</Col>
                                    <Col xs='6'>{l.description}</Col>
                                    { l.price ? <Col xs='1'>${l.price}</Col> : null }
                                    { !isTeacher ? <Col xs='2' offset='10'><Button>Enroll</Button></Col> : null }
                                </Row>
                            </li>
                        );
                    }) }
                </ul>
            </Container>
        );
    }
}

ListAllLessons.propTypes = {
    error: PropTypes.object.isRequired,
    allLessons: PropTypes.array,
    isTeacher: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error
});

export default connect(mapStateToProps, {})(ListAllLessons);