const express = require('express');
const httpStatus = require('http-status');
const helmet = require('helmet');
const xss = require('xss-clean');
const Sequelize = require("sequelize");

const app = express();

const routes = require('./routes');
const ApiError = require('./utils/ApiError');
const config = require('./config/config');
const { errorConverter, errorHandler } = require('./middlewares/error');

//set security headers
app.use(helmet());

//parse json request body
app.use(express.json());

//parse urlencoded request body
app.use(express.urlencoded({ extended: true}));

//sanitize request data
app.use(xss());

app.use('/v1', routes);

//send back 404
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not Found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

//handle all kind of error
app.use(errorHandler);

let server;
const sequelize = new Sequelize(
    config.mysql.db,
    config.mysql.user,
    config.mysql.password,
     {
       host: config.mysql.host,
       dialect: 'mysql'
     }
);

//connect to mysql db
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
    server = app.listen(config.port, () => {
        console.log(`Listening to Port: ${config.port}`);
    });
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

const exitHandler = () => {
    if(server) {
        server.close(() => {
            console.log('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};
const unexpectedErrorHandler = (error) => {
    console.log(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
