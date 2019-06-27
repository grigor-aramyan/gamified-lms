import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from './components/App';

ReactDOM.hydrate(
    <Router>
        <Route path='/'>
            <Switch>
                <Route exact path='/' component={App} />
                <Route path='/*' render={ () => {
                    return(
                        <div>
                            Component not implemented yet!)
                        </div>
                    );
                }} />
            </Switch>
        </Route>
    </Router>,
    document.getElementById('root')
);