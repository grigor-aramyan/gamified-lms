import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// utils
import { checkAuthenticationAndRedirect } from '../utils/utilFuncs';
import Header from './Header';

class Teachers extends Component {
    componentDidMount() {
        checkAuthenticationAndRedirect(this.props.isAuthenticated);
    }

    render() {
        return(
            <div>
                <Header />
                Teachers component will go here!
            </div>
        );
    }
}

Teachers.propTypes = {
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {})(Teachers);