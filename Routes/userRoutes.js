const express = require ('express')
const { Register, updateProfile } = require('../Controllers/userController')


const Route = express.Router()


Route.post('/register', Register )
Route.put('/update/:id', updateProfile )



module.exports = Route