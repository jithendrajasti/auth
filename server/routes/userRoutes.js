const express=require('express');
const userAuth = require('../middlewares/userAuthorisation.js');
const getUserData = require('../controllers/userController.js');

const userRouter=express.Router();

userRouter.get('/getUser',userAuth,getUserData);

module.exports=userRouter;