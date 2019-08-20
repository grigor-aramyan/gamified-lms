import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Container
} from 'reactstrap';

import { loadLocalToken, loadUser } from '../actions/authActions';

import Header from './Header';
import NotAuthenticated from './NotAuthenticated';

class CourseView extends Component {
    componentDidMount() {
        this.props.loadLocalToken();
        this.props.loadUser();
    }

    render() {
        const {
            isAuthenticated,
            isTeacher,
            error
        } = this.props;

        return(
            <div>
                <Header />
                { isAuthenticated && !isTeacher ?
                    <Container>
                        Course View goes here!
                    </Container>
                : <NotAuthenticated />
                }
            </div>
        );
    }
}

CourseView.propTypes = {
    error: PropTypes.object,
    isAuthenticated: PropTypes.bool,
    isTeacher: PropTypes.bool.isRequired,
    loadLocalToken: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    error: state.error,
    isAuthenticated: state.auth.isAuthenticated,
    isTeacher: state.auth.isTeacher
});

export default connect(mapStateToProps, {
    loadLocalToken,
    loadUser
})(CourseView);