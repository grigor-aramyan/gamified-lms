import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// utils
import { checkAuthenticationAndRedirect } from '../utils/utilFuncs';
import Header from './Header';

class Learners extends Component {
    componentDidMount() {
        checkAuthenticationAndRedirect(this.props.isAuthenticated);
    }

    render() {
        return(
            <div>
                <Header />
                Learners component will go here!
            </div>
        );
    }
}

Learners.propTypes = {
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {})(Learners);