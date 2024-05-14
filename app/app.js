const express = require('express');
const app = express();

const dotenv = require('dotenv').config();

// const users = require('./users.js');
const lines = require('./lines.js');
const stops = require('./stops.js');
const lists = require('./lists.js');
const calendars = require('./calendars.js');
//const users = require('./users.js');
const authentication = require('./authentication.js');
const tokenChecker = require('./tokenChecker.js');


/**
 * Configure Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* Swagger */
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pediline',
            version: '1.0.0',
        },
    },
    apis: ['./oas3.yaml'], // files containing annotations as above
};
const swaggerDocument = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // ? write in browser localhost:3000/api-docs

app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

app.use('/api/v1/stops', stops);
app.use('/api/v1/lines', lines);
app.use('/api/v1/lists', lists);
app.use('/api/v1/calendars', calendars);
//app.use('/api/v1/users', users);
app.use('api/v1/users/me', tokenChecker);
app.use('/api/v1/authenticate', authentication);



app.get('/', (req, res) => {
    res.send('Hello from PediLine!');
});


// const { auth } = require('express-openid-connect');

// const config = {
//   authRequired: false,
//   auth0Logout: true,
//   secret: process.env.AUTH_SECRET,
//   baseURL: 'http://localhost:3000',
//   clientID: process.env.AUTH_CLIENT_ID,
//   issuerBaseURL: 'https://dev-z7rq7o4n5qxdrkm2.us.auth0.com'
// };

// auth router attaches /login, /logout, and /callback routes to the baseURL
// app.use(auth(config));

// req.isAuthenticated is provided from the auth router
// app.get('/', (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });


/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;