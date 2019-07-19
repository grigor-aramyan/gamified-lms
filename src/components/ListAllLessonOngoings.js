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

class ListAllLessonOngoings extends Component {
    
    componentDidMount() {
        this.props.getLessonOngoings();
    }
    
    render() {
        const {
            deleteLessonOngoing,
            allLessonOngoings
        } = this.props;

        return(
            <Container>
                <h2>My ongoing lessons</h2>
                <Row
                    style={{ textAlign: 'center' }}>
                    <Col xs='4'>
                        ID
                    </Col>
                    <Col xs='4'>
                        LESSON ID
                    </Col>
                    <Col xs='2'>
                        DELETE
                    </Col>
                </Row>
                <ul>
                    { allLessonOngoings.map(l => {
                        return(
                            <li key={l.id}>
                                <Row>
                                    <Col xs='4'>
                                        {l.id}
                                    </Col>
                                    <Col xs='4'>
                                        {l.lessonId}
                                    </Col>
                                    <Col xs='2'>
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
    deleteLessonOngoing: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
    allLessonOngoings: state.lessonOngoing.allLessonOngoings
});

export default connect(mapStateToProps, {
   getLessonOngoings,
   deleteLessonOngoing 
})(ListAllLessonOngoings);