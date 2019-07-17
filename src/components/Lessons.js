import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Header from './Header';

// utils
import { checkAuthenticationAndRedirect } from '../utils/utilFuncs';

class Lessons extends Component {
    componentDidMount() {
        checkAuthenticationAndRedirect(this.props.isAuthenticated);
    }

    render() {
        return(
            <div>
                <Header />
                Lessons will go here.
            </div>
        );
    }
}

Lessons.propTypes = {
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {

})(Lessons);