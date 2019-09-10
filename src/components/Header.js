import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Container,
    Navbar,
    NavbarBrand
} from 'reactstrap';

import { logoutInit } from '../actions/authActions';

class Header extends Component {
    
    toggle = () => {
        const mainMenu = document.getElementById('menu');
        mainMenu.classList.toggle('menu-opened');
    }

    onSignOut = () => {
        this.props.logoutInit();
    }

    render() {
        const {
            isAuthenticated,
            isTeacher,
            learner,
            teacher
        } = this.props;

        let userName = null;
        if (isAuthenticated) {
            if (isTeacher) {
                userName = teacher.name;
            } else {
                userName = learner.name;
            }
        }

        const icon_style = {
            borderRadius: '10%',
            border: '2px solid orange',
            marginBottom: '5px'
        };

        return(
            <div>
                <Navbar color='dark' dark>
                    <NavbarBrand href='/'>Nidha Learning</NavbarBrand>
                    <a onClick={this.toggle} href='#'>
                        <img src='/images/hamburger_menu.png'
                            style={{
                                width: '30px',
                                height: '30px'
                            }} />
                    </a>
                </Navbar>
                <div id='menu' className='main-menu'>
                    <h4 style={{
                        color: 'grey',
                        fontStyle: 'italic'
                    }} className='mb-1'>Hello, { userName ? userName : 'guest' }</h4>
                    { !isAuthenticated ?
                        <div>
                            <a href='/login'>
                                <img
                                    src='/images/login_icon.png'
                                    style={icon_style}
                                    className='main-menu-icon-style'
                                />
                            </a>
                            <br />
                        </div> :
                        null
                    }
                    { !isAuthenticated ?
                        <div>
                            <a href='/register'>
                                <img
                                    src='/images/register_icon.png'
                                    style={icon_style}
                                    className='main-menu-icon-style'
                                />
                            </a>
                            <br />
                        </div> :
                        null
                    }

                    { isAuthenticated ?
                        <div>
                            <a href='/lessons'>
                                <img
                                    src='/images/lessons_icon.png'
                                    style={icon_style}
                                    className='main-menu-icon-style'
                                />
                            </a>
                            <br />
                        </div> :
                        null
                    }
                    { isAuthenticated ?
                        <div>
                            <a href='/courses'>
                                <img
                                    src='/images/courses_icon.jpg'
                                    style={icon_style}
                                    className='main-menu-icon-style'
                                />
                            </a>
                            <br />
                        </div> :
                        null
                    }
                    { (isAuthenticated && !isTeacher) ?
                        <div>
                            <a href='/lesson_ongoings'>
                                <img
                                    src='/images/lesson_ongoing_icon.png'
                                    style={icon_style}
                                    className='main-menu-icon-style'
                                />
                            </a>
                            <br />
                        </div> :
                        null
                    }
                    { (isAuthenticated && !isTeacher) ?
                        <div>
                            <a href='/course_ongoings'>
                                <img
                                    src='/images/course_ongoing_icon.png'
                                    style={icon_style}
                                    className='main-menu-icon-style'
                                />
                            </a>
                            <br />
                        </div> :
                        null
                    }
                    { isAuthenticated ?
                        <div>
                            <a href='/' onClick={this.onSignOut}>
                                <img
                                    src='/images/logout_icon.png'
                                    style={icon_style}
                                    className='main-menu-icon-style'
                                />
                            </a>
                            <br />
                        </div> :
                        null
                    }
                </div>
            </div>
        );
    }
}

Header.propTypes = {
    isAuthenticated: PropTypes.bool,
    isTeacher: PropTypes.bool.isRequired,
    logoutInit: PropTypes.func.isRequired,
    learner: PropTypes.object,
    teacher: PropTypes.object
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isTeacher: state.auth.isTeacher,
    learner: state.auth.learner,
    teacher: state.auth.teacher
});

export default connect(mapStateToProps, {
    logoutInit
})(Header);