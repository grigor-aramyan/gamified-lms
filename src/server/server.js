import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import App from '../components/App';

const PORT = 4242;

const server = express();

server.use(express.json());
server.use(express.static('dist'));

server.get('/*', (req, res) => {
    const initialMarkup = ReactDOMServer.renderToString(
        <StaticRouter location={req.url} context={{}}>
            <App />
        </StaticRouter>
    );

    res.send(`
        <html>
            <head>
                <title>Gamified LMS</title>
            </head>
            <body>
                <div id="root">${initialMarkup}</div>
                <script src="/main.js"></script>
            </body>
        </html>
    `);
});

server.listen(PORT, () => console.log(`server listening on port ${PORT}`));