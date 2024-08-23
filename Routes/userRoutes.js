const express = require ('express')
const { Register, updateProfile, loginUser } = require('../Controllers/userController')


const Route = express.Router()


Route.post('/register', Register )
Route.post('/login', loginUser )
Route.put('/update/:id', updateProfile )



module.exports = Route