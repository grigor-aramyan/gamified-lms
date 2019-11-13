import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Button,
    Container,
    FormGroup,
    Form
} from 'reactstrap';

let recorder = null;

class AddAudioExercise extends Component {
    state = {
        recording: false,
        currentRecordedAudioQuestion: null,
        stream: null
    }

    createDownloadLink = blob => {
        const url = URL.createObjectURL(blob);
        
        this.setState({
            currentRecordedAudioQuestion: url
        });
    }

    onStop = () => {
        recorder.stop();
        this.state.stream.getAudioTracks()[0].stop();

        this.setState({
            recording: false
        });

        recorder.exportWAV(this.createDownloadLink);
    }

    onStartRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(stream => {
                
                this.setState({
                    stream,
                    recording: true
                });
                
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                const audioContext = new AudioContext;
                const input = audioContext.createMediaStreamSource(stream);
                
                recorder = new Recorder(input, {
                    numChannels: 2
                }) 
                
                recorder.record();
        });
    }

    render() {
        const {
            currentRecordedAudioQuestion,
            recording
        } = this.state;

        return(
            <FormGroup
                style={{
                    border: '1px solid grey',
                    borderRadius: '2%',
                    padding: '2%'
                }}
                className='sat-container'>
                <h2>Add Audio Question</h2>
                <FormGroup>
                    <audio
                        src={ currentRecordedAudioQuestion }
                        id="player"
                        controls
                        style={{ verticalAlign: 'middle' }}></audio>
                    { recording ?
                        <a
                            href='javascript:void(0)'
                            onClick={this.onStop}>
                            <img
                                src='images/muted_icon.png'
                                style={{
                                    width: '50px',
                                    height: 'auto'
                                }} />
                        </a> :
                        <a
                            href='javascript:void(0)'
                            onClick={this.onStartRecording}>
                            <img
                                src='images/microphone_icon.png'
                                style={{
                                    width: '50px',
                                    height: 'auto'
                                }} />
                        </a>
                    }
                </FormGroup>
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