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

            sendmail(createdUser.email, "registration", `<h1>Registration successful, thank you for joining our platform</h1>`)

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
        else {
            res.status(400).json({ msg: "password or email incorrect" })
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
    return res.status(200).json({ msg: "logout successfully" })
}


// Forget Password
const forgetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        // Generate reset token using JWT
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });

        // Create reset URL
        const resetUrl = `${req.protocol}://${req.get('host')}/api/resetpassword/${resetToken}`;

        // Email the reset URL to the user
        const message = `<h1>Password Reset</h1><p>Please use the following link to reset your password: <a href="${resetUrl}" clicktracking=off>${resetUrl}</a></p>`;

        try {
            sendmail(user.email, 'Password Reset', message);
            res.status(200).json({ msg: 'Email sent' });
        } catch (error) {
            return res.status(500).json({ msg: 'Email could not be sent' });
        }

    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { resetToken } = req.params;
    const { password } = req.body;

    try {
        // Verify the reset token
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

        // Find the user by the decoded token's ID
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired token' });
        }

        // Hash the new password and save it
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        res.status(200).json({ msg: 'Password reset successful' });

    } catch (error) {
        return res.status(500).json({ msg: 'Invalid or expired token' });
    }
};


const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await UserModel.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            return res.status(401).json({ msg: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ msg: 'Not authorized, no token' });
    }
};


const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // Assuming you have a middleware that sets req.user based on the logged-in user's token.

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if old password matches
        const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!passwordIsCorrect) {
            return res.status(400).json({ msg: 'Old password is incorrect' });
        }

        // Hash the new password and save it
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(newPassword, salt);
        await user.save();

        return res.status(200).json({ msg: 'Password updated successfully' });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};



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

const getLoggedInStatus = async (req, res) => {

    const { token } = req.cookies

    console.log(req.cookies);


    try {
        if (!token) {
            return res.json(false)
        }

        // verify the token
        const verifiedToken = JWT.verify(token, process.env.JWT_SECRET)
        if (verifiedToken) {
            return res.json(true)
        }
    } catch (error) {
        console.log(error);

    }

}

const addimage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }
    return res.status(200).json({ msg: 'File uploaded successfully', file: req.file });
};



module.exports = {
    Register, loginUser, updateProfile, logout, forgetPassword, resetPassword, updatePassword, protect, getLoggedInStatus, addimage
}