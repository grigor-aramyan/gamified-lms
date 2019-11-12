import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Button,
    Container,
    FormGroup
} from 'reactstrap';

class AddAudioExercise extends Component {
    render() {
        return(
            <FormGroup
                style={{
                    border: '1px solid grey',
                    borderRadius: '2%',
                    padding: '2%'
                }}
                className='sat-container'>
                <h2>Add Audio Question</h2>
                <p>{ this.props.currentAqQuestion }</p>
            </FormGroup>
        );
    }
}

AddAudioExercise.propTypes = {
    error: PropTypes.object.isRequired,

    aqExercisesAll: PropTypes.array.isRequired,
    currentAqQuestion: PropTypes.string.isRequired,
    currentAqAnswer: PropTypes.string.isRequired,
    currentAqAllAnswers: PropTypes.array.isRequired,
    currentAqRightAnswerIndex: PropTypes.number.isRequired,
    addAqExerciseError: PropTypes.string.isRequired,
    addAqExerciseToAll: PropTypes.func.isRequired,
    addAqExerciseAnswer: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
});

export default connect(mapStateToProps, {
    
})(AddAudioExercise);