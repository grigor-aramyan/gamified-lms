import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Header from './Header';

// utils
import { checkAuthenticationAndRedirect } from '../utils/utilFuncs';

class LessonOngoings extends Component {
    componentDidMount() {
        checkAuthenticationAndRedirect(this.props.isAuthenticated);
    }

    render() {
        return(
            <div>
                <Header />
                LessonOngoings will go here
            </div>
        );
    }
}

LessonOngoings.propTypes = {
    isAuthenticated: PropTypes.func
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {})(LessonOngoings);