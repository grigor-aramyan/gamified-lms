import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// utils
import { checkAuthenticationAndRedirect } from '../utils/utilFuncs';
import Header from './Header';

class Courses extends Component {
    componentDidMount() {
        checkAuthenticationAndRedirect(this.props.isAuthenticated);
    }

    render() {
        return(
            <div>
                <Header />
                Courses will go here
            </div>
        );
    }
}

Courses.propTypes = {
    isAuthenticated: PropTypes.func
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {})(Courses);