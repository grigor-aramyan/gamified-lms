import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Container
} from 'reactstrap';

// Components
import Header from './Header';
import SplashView from './SplashView';

class App extends Component {
    render() {
        return(
            <Header />
        );
    }
}

App.propTypes = {

}

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, {

})(App);