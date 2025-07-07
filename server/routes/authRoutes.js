const express=require('express');
const { register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated, verifyResetPassword, sendResetPassword } = require('../controllers/authController.js');
const userAuth = require('../middlewares/userAuthorisation.js');
const getUserData = require('../controllers/userController.js');

const authRouter=express.Router();
authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/sendVerifyOtp',userAuth,sendVerifyOtp);
authRouter.post('/verifyAccount',userAuth,verifyEmail);
authRouter.get('/isAuth',userAuth,isAuthenticated);
authRouter.post('/resetPass',sendResetPassword);
authRouter.post('/verifyResetPass',verifyResetPassword);
module.exports=authRouter;