const express = require ('express')
const { Register, updateProfile, loginUser, logout } = require('../Controllers/userController')


const Route = express.Router()


Route.post('/register', Register )
Route.post('/login', loginUser )
Route.get('/logout', logout )
Route.put('/update/:id', updateProfile )



module.exports = Route