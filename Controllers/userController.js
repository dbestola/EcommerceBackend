const UserModel = require("../Models/user")




const Register = async (req, res) => {

    const { name, email, password } = req.body

    try {

        // Validation
        if (name == "" || email == "" || password == "") {
            return res.status(400).json({ msg: 'Please fill all required field!' })
        }

        const createdUser = UserModel.create({ name, email, password })

        if (createdUser) {
            return res.status(200).json({ msg: 'user created successfully' })
        }
        else {
            return res.status(400).json({ msg: 'failed to create user' })
        }


    }

    catch (error) {
        return res.status(500).json(error.message)

    }

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
    Register,
    updateProfile
}