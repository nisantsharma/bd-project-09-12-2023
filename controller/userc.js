const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;
 exports.auth= async(req,res,next)=>{
    try{
        const token = req.headers;
        if (!token) {
            return res.status(401).json({ error: 'Authentication token is required' });
        }
        const decodedToken = jwt.verify(token, 'your-secret-key');
        if (!decodedToken.userId) {
            return res.status(401).json({ error: 'Invalid token' });
          }
      
          const user = await User.findById(decodedToken.userId);
      
          if (!user) {
            return res.status(401).json({ error: 'User not found' });
          }
      
          req.user = user; 
          next();
    }
    catch(error){
    console.error(error);
    res.status(401).json({ error: 'Invalid token' });
      }
 }
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                const accessToken = jwt.sign(user.toJSON(), ACCESS_SECRET_KEY, { expiresIn: '1h' });
                return res.status(200).json({ accessToken, msg: 'Login successful' });
            } else {
                return res.status(400).json({ msg: 'Password does not match' });
            }
        } else {
            return res.status(400).json({ msg: 'Email does not match' });
        }
    } catch (err) {
        return res.status(500).json({ msg: 'Error while logging in the user' });
    }
};
exports.signupUser = async (req, res) => {
    try {
        const { fullname, email, password, age, gender, mobile } = req.body;
        const user = {
            fullname,
            email,
            password,
            age,
            gender,
            mobile,
        };
        const accessToken = jwt.sign(user, ACCESS_SECRET_KEY, { expiresIn: '1h' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;

        const newUser = new User(user);
        await newUser.save();

        return res.status(200).json({ msg: 'Signup successful', accessToken });
    } catch (err) {
        return res.status(500).json({ msg: 'Error while signing up the user' });
    }
};