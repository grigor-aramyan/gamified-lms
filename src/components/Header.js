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

    render() {
        const {
            isAuthenticated,
            isTeacher
        } = this.props;

        return(
            <div>
                <Navbar color='dark' dark>
                    <NavbarBrand href='/'>Gamified LMS</NavbarBrand>
                    <a onClick={this.toggle} href='#'>
                        <img src='/images/hamburger_menu.png'
                            style={{
                                width: '30px',
                                height: '30px'
                            }} />
                    </a>
                </Navbar>
                <div id='menu' className='main-menu'>
                    
                </div>
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
});

export default connect(mapStateToProps, {
    logoutInit
})(Header);