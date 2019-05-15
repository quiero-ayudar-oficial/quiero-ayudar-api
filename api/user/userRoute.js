const router = require('express').Router();
const passport = require('passport');

const userController = require('./userController');
const userCtrl = new userController();

router.post('/register', userCtrl.registerUser);
router.post('/login', userCtrl.login);
router.post('/dashboard', userCtrl.loginDashboard);
router.get(
  '/current',
  passport.authenticate('jwt', {
    session: false
  }),
  userCtrl.current
);
router.get(
  '',
  passport.authenticate('jwt', {
    session: false
  }),
  userCtrl.syncUsers
);
router.put(
  '',
  passport.authenticate('jwt', {
    session: false
  }),
  userCtrl.editUser
);
router.delete(
  '',
  passport.authenticate('jwt', {
    session: false
  }),
  userCtrl.deleteUser
);

module.exports = router;
