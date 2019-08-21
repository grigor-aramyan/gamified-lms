import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Container
} from 'reactstrap';

import {} from '../actions/lessonActions';

class CourseSingleLesson extends Component {
    render() {
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
    selectedLessonId: PropTypes.string
}

const mapStateToProps = (state) => ({
    error: state.error
});

export default connect(mapStateToProps, {

})(CourseSingleLesson);