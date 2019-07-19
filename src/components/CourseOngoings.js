import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Container
} from 'reactstrap';

import Header from './Header';
import NotAuthenticated from './NotAuthenticated';

import { loadLocalToken, loadUser } from '../actions/authActions';
import ListAllCourseOngoings from './ListAllCourseOngoings';

class CourseOngoings extends Component {
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
                {/* (isAuthenticated && isTeacher) ?
                    <div>
                        <Header />
                        <Container>
                            Teacher courses ongoings
                        </Container>           
                    </div>
                    : null
                */}
                { (isAuthenticated && !isTeacher) ?
                    <div>
                        <Header />
                        <Container>
                            <ListAllCourseOngoings />
                        </Container>           
                    </div>
                    : null
                }
                { (!isAuthenticated || (isAuthenticated && isTeacher)) ?
                    <NotAuthenticated /> 
                    : null
                }
            </div>
        );
    }
}

CourseOngoings.propTypes = {
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
})(CourseOngoings);