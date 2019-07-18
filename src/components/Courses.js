import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { loadLocalToken, loadUser } from '../actions/authActions';

import Header from './Header';
import NotAuthenticated from './NotAuthenticated';

class Courses extends Component {
    componentDidMount() {
        this.props.loadLocalToken();
        this.props.loadUser();
    }

    render() {
        const {
            isAuthenticated,
            isTeacher
        } = this.props;

        return(
            <div>
                { (isAuthenticated && isTeacher) ?
                    <div>
                        <Header />
                        <Container>
                            Teacher courses
                        </Container>           
                    </div>
                    : null
                }
                { (isAuthenticated && !isTeacher) ?
                    <div>
                        <Header />
                        <Container>
                            Learner courses
                        </Container>           
                    </div>
                    : null
                }
                { !isAuthenticated ?
                    <NotAuthenticated /> 
                    : null
                }
            </div>
        );
    }
}

Courses.propTypes = {
    isAuthenticated: PropTypes.bool,
    isTeacher: PropTypes.bool.isRequired,
    loadLocalToken: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isTeacher: state.auth.isTeacher
});

export default connect(mapStateToProps, {
    loadLocalToken,
    loadUser
})(Courses);