const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//register controller
const registerUser = async (req, res) => {
    try {
        //Extracting user information from the request body
        const { username, email, password, role } = req.body;

        //If the user is already existing in the database
        const checkExistingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: "Username or email id entered is already existing"
            });
        }

        //Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        //Creating a new user
        const newlyCreatedUser = new User({
            username,
            email,
            password: hashedpassword,
            role: role || "user"
        });

        await newlyCreatedUser.save();
        if (newlyCreatedUser) {
            res.status(200).json({
                success: true,
                message: "User successfully created"
            })
        }
        else {
            res.status(400).json({
                success: false,
                message: "Unable to register user please try again"
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong in the register controller"
        })
    }
}

//login controller
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            res.status(400).json({
                success: false,
                message: "Username does not exists"
            });
        }

        //To check is the password is correct or not
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            res.status(400).json({
                success: false,
                message: "Incorrect Password"
            });
        }

        //creating user token
        const accessToken = jwt.sign({
            userID: user._id,
            username: user.username,
            role: user.role
        },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '15m' });

        res.status(200).json({
            success: true,
            message: 'Logged in Successfully',
            accessToken
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong in the login controller"
        })
    }
};

const changePassword = async (req, res) => {
    try {
        const userID = req.userInfo.userID;

        //extarct old and new password
        const {oldpassword,newpassword} = req.body;

        //find the current logged in user
        const user = await User.findById(userID);

        if(!user){
            return res.status(400).json({
                success  : false ,
                message : "User not found"
            });
        }

        //check if the old password is correct
        const isPasswordMatch = await bcrypt.compare(oldpassword,user.password)
        if(!isPasswordMatch){
            return res.status(400).json({
                success  : false ,
                message : "Incorrect Pssword"
            });
        }
        
        //hasing the new password
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newpassword,salt);

        //Update user password
        user.password = newHashedPassword;
        user.save();

        res.status(200).json({
            success : true,
            message : "Password changed successfully"
        })
        
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong while changing password"
        })
    }
};


module.exports = { registerUser, loginUser ,changePassword };