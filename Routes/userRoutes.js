const express = require ('express')
const { Register, updateProfile, loginUser, logout, forgetPassword, resetPassword,  updatePassword, protect, getLoggedInStatus, addimage  } = require('../Controllers/userController')
const sendmail = require('../Utills/sendMail')
const { upload } = require('../Utills/fileUpload')


const Route = express.Router()


Route.post('/register', Register )
Route.post('/login', loginUser )
Route.get('/logout', logout )
Route.post('/forgetpassword', forgetPassword);
Route.put('/resetpassword/:resetToken', resetPassword);
Route.put('/updatepassword', protect, updatePassword);  
Route.get('/getloggedinstatus', getLoggedInStatus); 
Route.get('/sendmail', sendmail )
Route.put('/update/:id',  protect, updateProfile )
Route.post('/addimage', upload.single('image'), addimage )



module.exports = Route