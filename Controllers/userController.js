const UserModel = require("../Models/user")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendmail = require("../Utills/sendMail");





const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '2h' })
}


const Register = async (req, res) => {

    const { name, email, password } = req.body

    try {

        // Validation
        if (name == "" || email == "" || password == "") {
            return res.status(400).json({ msg: 'Please fill all required field!' })
        }

        if (password.length < 8) {
            return res.status(400).json({ msg: 'Password cannot be less than 8 xx' })
        }


        const UserExists = await UserModel.findOne({ email })

        if (UserExists) {
            return res.status(400).json({ msg: 'email already Exist try another!' })
        }

        // pawword hashing

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const createdUser = await UserModel.create({
            name: name,
            email: email,
            password: hashedPassword
        })

        const Token = generateToken(createdUser._id)
        res.cookie('token', Token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
            sameSite: 'none',
            secure: true
        })

        if (createdUser) {

            sendmail(createdUser.email, "registration", `<h1>Registration successful, thank you for joining our platform</h1>` )

            const { _id, name, email } = createdUser
            return res.status(201).json({ msg: 'user created successfully', _id, name, email, Token })
        }
        else {
            return res.status(400).json({ msg: 'failed to create user' })
        }


    }

    catch (error) {
        return res.status(500).json(error.message)

    }

}

const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please add email and password!' })
        }

        const UserExist = await UserModel.findOne({ email })

        if (!UserExist) {
            return res.status(400).json({ msg: 'user not found please register!' })
        }
        const passwordIsCorrect = await bcrypt.compare(password, UserExist.password)
        

        const Token = generateToken(UserExist._id)

        res.cookie('token', Token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
            sameSite: 'none',
            secure: true
        })

        if (UserExist && passwordIsCorrect) {
            const { _id, name, email } = UserExist
            res.status(200).json({ _id, name, email })
        }
        else{
            res.status(400).json({msg:"password or email incorrect"})
        }
    } catch (error) {
        res.status(500).json({ mgs: 'invalid user' })
    }
}

const logout = async (req, res) => {

    res.cookie('token', '', {
        path: '/',
        httpOnly: true,
        expires: new Date(0),
        sameSite: 'none',
        secure: true
    })
   return  res.status(200).json({msg: "logout successfully" })
}


const updateProfile = async (req, res) => {
    const { id } = req.params
    const { address, phone, avatar } = req.body;

    try {

        const user = await UserModel.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    address,
                    phone,
                    avatar
                }
            },
            { new: true, runValidators: true }
        )
        if (!user) {
            return res.status(400).json({ msg: 'user not found' })
        }
        else {
            return res.status(200).json({ msg: 'Profile updated successfully', updatedUser: user });
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }

}


module.exports = {
    Register, loginUser, updateProfile, logout
}