const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'invalid Email Address'],
        trim:true
    },
    password:{
        type:String,
        minLength:[8, 'password cannot be less than 8 characters'],
        // maxLength:[32, 'password cannot be more than 32 characters'],
    },
    address:{
        type:String,
    },
    phone:{
        type:String,
    },
    avatar:{
        type:String,
    }
}, {
    timestamps:true
})


const UserModel = mongoose.model('user', userSchema)

module.exports = UserModel