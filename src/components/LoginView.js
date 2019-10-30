import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Form,
    Input,
    Button,
    Container
} from 'reactstrap';

import { 
    TEACHER_LOGIN_ERROR,
    LEARNER_LOGIN_ERROR,
    loginInit,
    switchToLearnerLogin,
    swtchToTeacherLogin,
    loadLocalToken,
    loadUser
    } from '../actions/authActions';

// Components
import Header from './Header';

class LoginView extends Component {
    componentDidMount() {
        this.props.loadLocalToken();
        this.props.loadUser();
    }

    state = {
        loginAsTeacher: true,
        teacherEmail: '',
        teacherPassword: '',
        teacherError: '',
        learnerEmail: '',
        learnerPassword: '',
        learnerError: ''
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onLogin = () => {
        const {
            loginAsTeacher,
            teacherEmail,
            teacherPassword,
            teacherError,
            learnerEmail,
            learnerPassword,
            learnerError
        } = this.state;

        if (loginAsTeacher) {
            if (!(teacherEmail && teacherPassword)) {
                this.setState({ teacherError: 'Both fields required!' });
            } else {
                const newTeacher = {
                    email: teacherEmail,
                    password: teacherPassword,
                    kind: 'Teacher'
                };

                this.props.loginInit(newTeacher);
                this.setState({ teacherError: '' });
            }
        } else if (!loginAsTeacher) {
            if (!(learnerEmail && learnerPassword)) {
                this.setState({ learnerError: 'Both fields required!' });
            } else {
                const newLearner = {
                    email: learnerEmail,
                    password: learnerPassword,
                    kind: 'Learner'
                };
                this.props.loginInit(newLearner);
                this.setState({ learnerError: '' });
            }
        }
    }

    render() {
        const { 
            isAuthenticated,
            isTeacher,
            learner,
            teacher,
            error
        } = this.props;

        /*let userName = null;
        if (isAuthenticated) {
            if (isTeacher) {
                userName = teacher.name;
            } else {
                userName = learner.name;
            }
        }*/

        return(
            <div>
                <Header />
                <Container className='mt-2'>
                    { !isAuthenticated ?
                        <div className='login-form'>
                            <span>Login as: </span>
                            <Button style={{ backgroundColor: 'pink', color: 'blue' }} className='ml-1' onClick={ () => {
                                this.setState({ loginAsTeacher: true});
                                this.props.swtchToTeacherLogin();
                            }}>Teacher</Button>
                            <Button style={{ backgroundColor: 'grey', color: 'lime' }} className='ml-1' onClick={ () => {
                                this.setState({ loginAsTeacher: false });
                                this.props.switchToLearnerLogin();
                            } }>Learner</Button>
                            <br />

                            <Form className='mt-2'>
                                <Input
                                    type='email'
                                    name={ this.state.loginAsTeacher ? 'teacherEmail' : 'learnerEmail' }
                                    placeholder='Email'
                                    value={ this.state.loginAsTeacher ? this.state.teacherEmail : this.state.learnerEmail }
                                    onChange={this.onChange}
                                    className='mb-1' />
                                <Input
                                    type='password'
                                    name={ this.state.loginAsTeacher ? 'teacherPassword' : 'learnerPassword' }
                                    placeholder='Password'
                                    value={ this.state.loginAsTeacher ? this.state.teacherPassword : this.state.learnerPassword }
                                    onChange={this.onChange}
                                    className='mb-1' />
                                { (this.state.loginAsTeacher && (this.state.teacherError !== '')) ?
                                        <span style={{
                                            display: 'block',
                                            color: 'red',
                                            fontSize: '90%',
                                            fontStyle: 'italic'
                                        }}>{ this.state.teacherError }</span> :
                                        null }
                                    { (!this.state.loginAsTeacher && (this.state.learnerError !== '')) ?
                                        <span style={{
                                            display: 'block',
                                            color: 'red',
                                            fontSize: '90%',
                                            fontStyle: 'italic'
                                        }}>{ this.state.learnerError }</span> :
                                        null }
                                    
                                    { (this.state.loginAsTeacher && (error.id === TEACHER_LOGIN_ERROR)) ?
                                        <span style={{
                                            display: 'block',
                                            color: 'red',
                                            fontSize: '90%',
                                            fontStyle: 'italic'
                                        }}>{ error.msg.msg }</span> :
                                        null }
                                    { (!this.state.loginAsTeacher && (error.id === LEARNER_LOGIN_ERROR)) ?
                                        <span style={{
                                            display: 'block',
                                            color: 'red',
                                            fontSize: '90%',
                                            fontStyle: 'italic'
                                        }}>{ error.msg.msg }</span> :
                                        null }
                                <Button
                                    onClick={this.onLogin}
                                    className='mt-2'
                                    style={{
                                        backgroundColor: 'deepskyblue',
                                        border: 'none'
                                    }}>
                                        Login as: { this.state.loginAsTeacher ? 'Teacher' : 'Learner' }
                                </Button>
                            </Form>
                        </div> : null
                    }
                    { isAuthenticated ?
                        <div
                            style={{
                                textAlign: 'center'
                            }}>
                            <img
                                style={{
                                    marginTop: '20vh'
                                }}
                                src='/images/logo_with_chit_transparent.png' />
                        </div>
                    : null
                    }
                </Container>
            </div>
        );
    }
}

LoginView.propTypes = {
    isAuthenticated: PropTypes.bool,
    isTeacher: PropTypes.bool,
    learner: PropTypes.object,
    teacher: PropTypes.object,
    loginInit: PropTypes.func.isRequired,
    error: PropTypes.object.isRequired,
    switchToLearnerLogin: PropTypes.func.isRequired,
    swtchToTeacherLogin: PropTypes.func.isRequired,
    loadLocalToken: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isTeacher: state.auth.isTeacher,
    learner: state.auth.learner,
    teacher: state.auth.teacher,
    error: state.error
});

export default connect(mapStateToProps, {
    loginInit,
    switchToLearnerLogin,
    swtchToTeacherLogin,
    loadLocalToken,
    loadUser
})(LoginView);