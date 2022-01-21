const express = require('express')
const routes = express.Router();
const registerController= require('../controllers/registerController')

routes.post('/',registerController.handleNewUser);
module.exports = routes;