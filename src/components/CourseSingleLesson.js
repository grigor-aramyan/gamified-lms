import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Container,
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    Button
} from 'reactstrap';

import {} from '../actions/lessonActions';
import { getSATExercisesByLessonId } from '../actions/exerciseActions';

class CourseSingleLesson extends Component {
    render() {
        
        const {
            updateCompletionPointsOfCourse
        } = this.props;

        return(
            <div>
                Single lesson component goes here!
                <p>Current lesson id {this.props.selectedLessonId}</p>
            </div>
        );
    }
}

CourseSingleLesson.propTypes = {
    error: PropTypes.object,
    selectedLessonId: PropTypes.string,
    updateCompletionPointsOfCourse: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error
});

export default connect(mapStateToProps, {

})(CourseSingleLesson);