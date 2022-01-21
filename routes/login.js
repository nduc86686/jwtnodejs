const express = require('express')
const routes = express.Router();
const loginController = require('../controllers/authController')

routes.post('/',loginController.handleLogin);
module.exports = routes;