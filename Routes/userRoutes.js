const express = require ('express')
const { Register } = require('../Controllers/userController')


const Route = express.Router()


Route.post('/register', Register )



module.exports = Route