const express = require('express');
const authRoute = require('./auth.route');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/users',
        route: authRoute
    }
];


defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;