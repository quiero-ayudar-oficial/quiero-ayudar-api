const router = require('express').Router();
const users = require('./user/userRoute');

router.use('/users', users);

module.exports = router;
