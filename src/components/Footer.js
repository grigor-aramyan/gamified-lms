import React, { Component } from 'react';
import {
    Row,
    Col
} from 'reactstrap';

export default class Footer extends Component {
    render() {
        return(
            <Row
                className='footer-row'
                style={{
                    backgroundColor: 'gray',
                    marginTop: '2vh'
                }}>
                <Col xs='4' className='pt-2'>
                    <img
                        src='/images/logo_clean_transparent.png'
                        style={{
                           width: '60px',
                           height: '60px' 
                        }}
                        className='ml-2' />
                </Col>
                <Col
                    xs='8'
                    className='pl-2 pt-2'
                    style={{
                        color: 'white'
                    }}>
                    <Row>
                        <img
                            src='/images/phone_icon.png'
                            style={{
                                width: '20px',
                                height: '20px'
                            }}
                            className='mr-2'
                        />
                        +86 15611261080
                    </Row>
                    <Row>
                        <img
                            src='/images/mail_icon.png'
                            style={{
                                width: '20px',
                                height: '20px'
                            }}
                            className='mr-2'
                        />
                        rishi@omchit.org
                    </Row>
                    <Row>&copy;2019, Chit Learning. All rights reserved.</Row>
                </Col>
            </Row>
        );
    }
}