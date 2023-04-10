const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/users',
        route: authRoute
    },
    {
        path: '/auth',
        route: userRoute,
    },
];


defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;