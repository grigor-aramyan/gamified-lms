import React from 'react';
import {
    Button,
    Container
} from 'reactstrap';

export default function() {
    return(
        <Container>
            <h2>Not Authenticated!</h2>
            <Button onClick={ () => { window.location.replace('/'); } }>Go to Login</Button>
        </Container>
    );
}