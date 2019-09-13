import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Container,
    Form,
    Input,
    Button,
    FormGroup,
    Label
} from 'reactstrap';

import { createTeacher, CREATE_TEACHER_ERROR } from '../actions/teacherActions';
import { createLearner, CREATE_LEARNER_ERROR } from '../actions/learnerActions';
import { loadLocalToken, loadUser } from '../actions/authActions';

// components
import Header from './Header';


class Register extends Component {
    componentDidMount() {
        if (this.props.isAuthenticated) {
            window.location.replace('/');
        } else {
            this.props.loadLocalToken();
            this.props.loadUser();
        }
    }

    componentDidUpdate() {
        if (this.props.isAuthenticated || this.props.learner || this.props.teacher) {
            window.location.replace('/');
        }
    }

    state = {
        registerAsTeacher: true,
        teacherName: '',
        teacherEmail: '',
        teacherPassword: '',
        teacherSubject: '',
        teacherError: '',
        learnerName: '',
        learnerEmail: '',
        learnerPassword: '',
        learnerError: ''
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onRegister = () => {
        if (this.state.registerAsTeacher) {
            const {
                teacherName,
                teacherEmail,
                teacherPassword,
                teacherSubject
            } = this.state;

            if (!teacherName || !teacherEmail || !teacherPassword || !teacherSubject) {
                this.setState({ teacherError: 'All fields required!' });
            } else {
                const newTeacher = {
                    name: teacherName,
                    email: teacherEmail,
                    password: teacherPassword,
                    subject: teacherSubject
                };
        
                this.props.createTeacher(newTeacher);
                this.setState({ teacherError: '' });
            }

        } else {
            const {
                learnerName,
                learnerEmail,
                learnerPassword
            } = this.state;

            if (!learnerName || !learnerEmail || !learnerPassword) {
                this.setState({ learnerError: 'All fields required!' });
            } else {
                const newLearner = {
                    name: learnerName,
                    email: learnerEmail,
                    password: learnerPassword
                };
    
                this.props.createLearner(newLearner);
                this.setState({ learnerError: '' });
            }
        }
    }

    render() {
        const { error } = this.props;

        return(
            <div>
                <Header />
                <Container>
                    <div
                        className='login-form'
                        style={{
                            marginTop: '10%'
                        }}>
                        <span>Register as: </span>
                        <Button style={{ backgroundColor: 'pink', color: 'blue' }} className='ml-1' onClick={ () => this.setState({ registerAsTeacher: true })}>Teacher</Button>
                        <Button style={{ backgroundColor: 'grey', color: 'lime' }} className='ml-1' onClick={ () => this.setState({ registerAsTeacher: false })}>Learner</Button>
                        <br />
                        <Form className='mt-3'>
                            <Input
                                type='text'
                                name={ this.state.registerAsTeacher ? 'teacherName' : 'learnerName' }
                                placeholder='Name'
                                onChange={this.onChange}
                                className='mb-1' />
                            <Input
                                type='email'
                                name={ this.state.registerAsTeacher ? 'teacherEmail' : 'learnerEmail' }
                                placeholder='Email'
                                onChange={this.onChange}
                                className='mb-1' />
                            <Input
                                type='password'
                                name={ this.state.registerAsTeacher ? 'teacherPassword' : 'learnerPassword' }
                                placeholder='Password'
                                onChange={this.onChange}
                                className='mb-1' />
                            { this.state.registerAsTeacher ?
                                <FormGroup>
                                    <Label for='teacherSubjectId'>Select your Subject</Label>
                                    <Input
                                        type='select'
                                        name='teacherSubject'
                                        id='teacherSubjectId'
                                        onChange={this.onChange}>
                                        <option></option>
                                        <option>Math</option>
                                        <option>Art</option>
                                        <option>Physics</option>
                                        <option>Piano</option>
                                        <option>English</option>
                                    </Input>
                                </FormGroup> :
                                null
                            }
                            { (this.state.registerAsTeacher && (this.state.teacherError !== '')) ?
                                <span style={{
                                    display: 'block',
                                    color: 'red',
                                    fontSize: '90%',
                                    fontStyle: 'italic'
                                }}>{ this.state.teacherError }</span> :
                                null }
                            { (!this.state.registerAsTeacher && (this.state.learnerError !== '')) ?
                                <span style={{
                                    display: 'block',
                                    color: 'red',
                                    fontSize: '90%',
                                    fontStyle: 'italic'
                                }}>{ this.state.learnerError }</span> :
                                null }
                            
                            { (this.state.registerAsTeacher && (error.id === CREATE_TEACHER_ERROR)) ?
                                <span style={{
                                    display: 'block',
                                    color: 'red',
                                    fontSize: '90%',
                                    fontStyle: 'italic'
                                }}>{ error.msg.msg }</span> :
                                null }
                            { (!this.state.registerAsTeacher && (error.id === CREATE_LEARNER_ERROR)) ?
                                <span style={{
                                    display: 'block',
                                    color: 'red',
                                    fontSize: '90%',
                                    fontStyle: 'italic'
                                }}>{ error.msg.msg }</span> :
                                null }

                            <Button
                                className='mt-1'
                                style={{
                                    backgroundColor: 'deepskyblue',
                                    border: 'none'
                                }}
                                onClick={this.onRegister}>Register as { this.state.registerAsTeacher ? 'Teacher' : 'Learner' }</Button>
                        </Form>
                    </div>
                </Container>
            </div>
        );
    }
}

Register.propTypes = {
    error: PropTypes.object.isRequired,
    learner: PropTypes.object,
    teacher: PropTypes.object,
    createLearner: PropTypes.func.isRequired,
    createTeacher: PropTypes.func.isRequired,
    loadLocalToken: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = (state) => ({
    error: state.error,
    learner: state.learner.learner,
    teacher: state.teacher.teacher,
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {
    createLearner,
    createTeacher,
    loadLocalToken,
    loadUser
})(Register);