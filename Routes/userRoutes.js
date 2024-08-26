const express = require ('express')
const { Register, updateProfile, loginUser, logout } = require('../Controllers/userController')
const sendmail = require('../Utills/sendMail')


const Route = express.Router()


Route.post('/register', Register )
Route.post('/login', loginUser )
Route.get('/logout', logout )
Route.get('/sendmail', sendmail )
Route.put('/update/:id', updateProfile )



module.exports = Route