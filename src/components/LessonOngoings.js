import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Header from './Header';
import NotAuthenticated from './NotAuthenticated';

import { loadLocalToken, loadUser } from '../actions/authActions';

class LessonOngoings extends Component {
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
                            Teacher lesson ongoings
                        </Container>           
                    </div>
                    : null
                }
                { (isAuthenticated && !isTeacher) ?
                    <div>
                        <Header />
                        <Container>
                            Learner lesson ongoings
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

LessonOngoings.propTypes = {
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
})(LessonOngoings);