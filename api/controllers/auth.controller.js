import User from '../models/user.model.js' 
import { errorHandler } from '../utils/error.js'
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    //Tries for signup, if error it catches that and send the message
    try{
        await newUser.save()
        res.status(201).json("User Created Successfully");
    } catch(error){
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try{
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User not found!'));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Wrong Credentials!'));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
    } catch(error){
        next(error);
    }
};

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if(user){
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
        }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); 
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({ username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email: req.body.email, password: hashedPassword, avatar: req.body.photo });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
        }
    } catch (error) {
        next(error)
    }
}
export const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out.');
    } catch (error) {
        next(error)
    }
}

export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        // Generate a unique token for password reset
        const token = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
        // Store the token in the database
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 300000; // Token expires in 5 minutes
        await user.save();
        // Send password reset email to the user
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Link',
            html: `
                <h1>Password Reset</h1>
                <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                <p><a href="http://localhost:5173/reset-password/${token}" style="color:blue;">http://localhost:5173/reset-password/${token}</a></p>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                <p>The link will expire in 5 minutes</p>
                <p>Sincerely, <br/> Co-WorkHub Support Team</p>
            `
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    const { token, newPassword } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }
        // Update user's password
        const hashedPassword = bcryptjs.hashSync(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        next(error);
    }
};