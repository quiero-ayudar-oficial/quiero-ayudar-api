const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserModel = require('./userModel');
const OrganizationModel = require('../organization/organizationModel');
const keys = require('../../config/keys');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

class UserController {
  registerUser(req, res) {
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    UserModel.findOne({
      email: req.body.email
    }).then(user => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      } else {
        const { name, email, password, role } = req.body;

        const newUser = new UserModel({
          name,
          email,
          password
        });

        if (role) {
          newUser.role = role;
        }

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => res.status(400).json(err));
          });
        });
      }
    });
  }

  login(req, res) {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { email, password } = req.body;

    // Find user by email
    UserModel.findOne({
      email
    }).then(user => {
      // Check for user
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      // Check Password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User Matched
          const payload = {
            id: user.id,
            name: user.name,
            email: user.email
          }; // Create JWT Payload

          // Sign Token
          jwt.sign(payload, keys.secretOrKey, (err, token) => {
            res.json({ success: true, token, user });
          });
        } else {
          errors.password = 'Password incorrect';
          return res.status(400).json(errors);
        }
      });
    });
  }

  loginDashboard(req, res) {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { email, password } = req.body;

    // Find user by email
    UserModel.findOne({
      email
    }).then(user => {
      // Check for user
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      // Check for role
      if (user.role === 'user') {
        errors.role = 'User not have access';
        return res.status(404).json(errors);
      }

      // Check for organization
      if (!user.organization && user.role !== 'owner') {
        errors.restaurant = 'User not have restaurant';
        return res.status(404).json(errors);
      }

      // Check Password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User Matched
          const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }; // Create JWT Payload

          // Sign Token
          jwt.sign(payload, keys.secretOrKey, (err, token) => {
            res.json({ success: true, token, user });
          });
        } else {
          errors.password = 'Password incorrect';
          return res.status(400).json(errors);
        }
      });
    });
  }

  async syncUsers(req, res) {
    try {
      const { userId } = req.query;

      const query = {
        status: {
          $ne: 'deleted'
        },
        role: {
          $ne: 'owner'
        }
      };

      if (userId) {
        query._id = userId;
      }

      const users = await UserModel.find(query);

      if (userId) res.json(users[0]);
      else res.json(users);
    } catch (err) {
      res.status(400).json({
        error: err.message
      });
    }
  }

  async current(req, res) {
    res.json(req.user);
  }

  async editUser(req, res) {
    try {
      const {
        userId,
        email,
        name,
        password,
        role,
        restaurant
      } = req.body;

      if (!userId) {
        return res.status(400).json({
          error: 'Not found user'
        });
      }

      const user = await UserModel.findOne({
        _id: userId
      });

      const lastOrganization = user.organization;
      const removeOng = organization === 'none';

      user.name = name || user.name;
      user.email = email || user.email;
      user.password = password || user.password;
      user.role = role || user.role;
      user.organization = removeOng
        ? undefined
        : organization || user.organization;

      await user.save();

      if (removeOng && lastOrganization) {
        const lorganization = await OrganizationModel.findOne({
          _id: lastOrganization
        });
        lorganization.ong = lorganization.ong.filter(
          ong => ong.toString() !== userId
        );
        await lorganization.save();
      }

      if (!removeOng) {
        const lorganization = await OrganizationModel.findOne({
          _id: organization
        });
        lorganization.ong.push(userId);
        await lorganization.save();
      }

      res.json(user);
    } catch (err) {
      res.status(400).json({
        error: err.message
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          error: 'Not found user'
        });
      }

      const user = await UserModel.findOne({
        _id: userId
      });

      user.status = 'deleted';
      await user.save();
      res.json(user);
    } catch (err) {
      res.status(400).json({
        error: err.message
      });
    }
  }
}

module.exports = UserController;
