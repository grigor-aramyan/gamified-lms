import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Button,
    Container,
    FormGroup,
    Form,
    Input,
    Label
} from 'reactstrap';

let recorder = null;

class AddAudioExercise extends Component {
    state = {
        recording: false,
        currentRecordedAudioQuestion: null,
        stream: null,
        currentAqAnswerImage: ''
    }

    createDownloadLink = blob => {
        const url = URL.createObjectURL(blob);
        const filename = url.split('/')[url.split('/').length - 1];
        
        var metadata = {
            contentType: 'audio/mp3'
        };

        const storageRef = firebase.storage().ref();
        const uploadTask = storageRef.child(`aqs/${filename}.mp3`).put(blob, metadata);
        uploadTask.on('state_changed', (snapshot) => {

        }, (error) => {

        }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                this.props.onAddCurrentAqQuestion(downloadURL);
            });
        });

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
                    numChannels: 1
                }) 
                
                recorder.record();
        });
    }

    addAqExerciseAnswer = () => {
        const {
            currentAqAnswerImage
        } = this.state;

        if (!currentAqAnswerImage) {

            this.props.onAddAqExerciseError('Provide some image URI, please!')
        
        } else if (!currentAqAnswerImage.endsWith('png')
            && !currentAqAnswerImage.endsWith('jpg')
            && !currentAqAnswerImage.endsWith('jpeg')) {
        
                this.props.onAddAqExerciseError('Image URI does not look correct');
        
        } else {
            this.props.addAqExerciseAnswer(currentAqAnswerImage);
            this.setState({
                currentAqAnswerImage: ''
            });
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const {
            currentRecordedAudioQuestion,
            recording,
            currentAqAnswerImage
        } = this.state;

        const {
            addAqExerciseError,
            currentAqRightAnswerIndex,
            currentAqAllAnswers,
            aqExercisesAll
        } = this.props;

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
                    <br />
                    <Input
                        type='text'
                        name='currentAqAnswerImage'
                        placeholder='Add some image URL...'
                        value={currentAqAnswerImage}
                        onChange={this.onChange}
                        className='mb-1 mr-1 mt-2 sat-input'
                        style={{display: 'inline'}} />
                    <Button
                        size='sm'
                        color='primary'
                        outline
                        onClick={this.addAqExerciseAnswer}>
                            +
                    </Button>
                    <br />
                    { currentAqAllAnswers.length > 0 ?
                        <ul style={{ listStyle: 'none' }}>
                            { currentAqAllAnswers.map((a, index) => {
                                let styles = null;
                                if (index == currentAqRightAnswerIndex) {
                                    styles = {
                                        backgroundColor: 'green',
                                        padding: '2%',
                                        display: 'inline'
                                    }
                                } else {
                                    styles = {
                                        padding: '1%',
                                        display: 'inline'
                                    };
                                }

                                return(
                                    <li key={index} style={styles}>
                                        <img src={a} style={{
                                            width: '50px',
                                            height: 'auto'
                                        }} />
                                    </li>
                                );
                            })}
                        </ul>
                    : null
                    }
                    <FormGroup>
                        <Label
                            for='rightAnswerIndexId'
                            style={{
                                display: 'block'
                            }}>
                            Right answer index
                        </Label>
                        <Input
                            id='rightAnswerIndexId'
                            type='number'
                            name='currentAqRightAnswerIndex'
                            placeholder='Right answer index (starting from 0)...'
                            value={currentAqRightAnswerIndex}
                            onChange={ (e) => this.props.onChooseAqRightAnswerIndex(parseInt(e.target.value)) }
                            min={0}
                            max={ (currentAqAllAnswers.length == 0) ? 0 : (currentAqAllAnswers.length - 1) }
                            className='mb-1  sat-input'
                            style={{display: 'inline'}} />
                    </FormGroup>
                    { addAqExerciseError ?
                        <span style={{
                            display: 'block',
                            color: 'red',
                            fontSize: '90%',
                            fontStyle: 'italic'
                        }}>{addAqExerciseError}</span> 
                    : null
                    }
                    <Button
                        size='sm'
                        color='primary'
                        outline
                        onClick={this.props.addAqExerciseToAll}
                        style={{
                            display: 'block'
                        }}>
                            Add Audio Exercise
                    </Button>
                    { (aqExercisesAll.length > 0) ?
                        <div>
                            <h4>All Audio questions</h4>
                            <ul>
                                {aqExercisesAll.map((s, index) => {
                                    return(
                                        <li key={index} style={{
                                            border: '1px solid grey',
                                            padding: '2%'
                                            }}
                                            className='mb-1'>
                                            <audio
                                                src={ s.audioQuestion }
                                                controls
                                                style={{ verticalAlign: 'middle' }}>
                                            </audio>
                                            <ul>
                                                {s.answerImages.map((an, i) => {
                                                    let styles2 = null;
                                                    if (i == s.rightAnswerIndex) {
                                                        styles2 = {
                                                            backgroundColor: 'green',
                                                            padding: '2%',
                                                            display: 'inline'
                                                        }
                                                    } else {
                                                        styles2 = {
                                                            padding: '1%',
                                                            display: 'inline'
                                                        };
                                                    }
                                                    return(
                                                        <li key={i} style={styles2}>
                                                            <img src={an} style={{
                                                                width: '50px',
                                                                height: 'auto'
                                                            }} />
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    : null }
                </FormGroup>
            </FormGroup>
        );
    }
}

AddAudioExercise.propTypes = {
    error: PropTypes.object.isRequired,

    aqExercisesAll: PropTypes.array.isRequired,
    currentAqQuestion: PropTypes.string.isRequired,
    currentAqAllAnswers: PropTypes.array.isRequired,
    currentAqRightAnswerIndex: PropTypes.number.isRequired,
    addAqExerciseError: PropTypes.string.isRequired,
    addAqExerciseToAll: PropTypes.func.isRequired,
    addAqExerciseAnswer: PropTypes.func.isRequired,
    onAddCurrentAqQuestion: PropTypes.func.isRequired,
    onAddAqExerciseError: PropTypes.func.isRequired,
    onChooseAqRightAnswerIndex: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
});

export default connect(mapStateToProps, {
    
})(AddAudioExercise);