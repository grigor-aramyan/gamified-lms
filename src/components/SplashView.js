import React, { Component } from 'react';
import {
    Container,
    Spinner
} from 'reactstrap';

export default class SplashView extends Component {
    componentDidMount() {
        setTimeout(() => {
            window.location.replace('/');
        }, 3000);
    }

    render() {
        return(
            <div>
                <Container
                    style={{
                        width: '90vw',
                        height: '90vh',
                        marginTop: '5vh',
                        backgroundColor: 'deepskyblue',
                        borderRadius: '10%',
                        textAlign: 'center'
                    }}>
                    <Spinner type='grow'
                        style={{
                            width: '20vw',
                            height: '20vw',
                            color: 'white',
                            marginTop: '10vh'
                        }} />
                    <h4 style={{
                        color: 'white'
                    }}
                        className='mt-1'>Preparing...</h4>
                </Container>
            </div>
        );
    }
}