const  bcrypt = require('bcrypt');

const UserModel = require('../models/user.model');
const UserController = require('./user.controller');
const TokenHelper = require('../helper/token')

const AuthController = {
    register: UserController.create,
    async login(req, res) {
        const {email, password} = req.body;
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password_hash)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })            
        }
        const accessToken = TokenHelper.signAccessToken(user)

        return res.status(200).json({
            user,
            access_token: accessToken
        })
    }
}

module.exports = AuthController