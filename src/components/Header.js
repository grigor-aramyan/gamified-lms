import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import PropTypes from 'prop-types';

import { logoutInit } from '../actions/authActions';

class Header extends Component {
    
    onSignOut = () => {
        this.props.logoutInit();
    }

    render() {
        const {
            isAuthenticated,
            isTeacher
        } = this.props;

        return(
            <div>
                <Navbar color='dark' dark expand='md'>
                    <NavbarBrand href='/'>Gamified LMS</NavbarBrand>
                    <Nav navbar className='ml-auto'>
                        { !isAuthenticated ? 
                            <NavItem>
                                <NavLink href='/'>Login</NavLink>
                            </NavItem> :
                            null
                        }
                        { !isAuthenticated ? 
                            <NavItem>
                                <NavLink href='/register'>Register</NavLink>
                            </NavItem> :
                            null
                        }
                        { isAuthenticated ? 
                            <NavItem>
                                <NavLink href='/lessons'>My lessons</NavLink>
                            </NavItem> :
                            null
                        }
                        { isAuthenticated ? 
                            <NavItem>
                                <NavLink href='/courses'>My courses</NavLink>
                            </NavItem> :
                            null
                        }
                        { (isAuthenticated && !isTeacher) ? 
                            <NavItem>
                                <NavLink href='/lesson_ongoings'>Lesson Ongoings</NavLink>
                            </NavItem> :
                            null
                        }
                        { (isAuthenticated && !isTeacher) ?
                            <NavItem>
                                <NavLink href='/course_ongoings'>Course Ongoings</NavLink>
                            </NavItem> :
                            null
                        }
                        { isAuthenticated ?
                            <NavItem>
                                <NavLink href='/' onClick={this.onSignOut}>Sign Out</NavLink>
                            </NavItem> :
                            null
                        }
                    </Nav>
                </Navbar>
            </div>
        );
    }
}

Header.propTypes = {
    isAuthenticated: PropTypes.bool,
    isTeacher: PropTypes.bool.isRequired,
    logoutInit: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isTeacher: state.auth.isTeacher
})

export default connect(mapStateToProps, {
    logoutInit
})(Header);