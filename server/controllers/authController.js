const userModel=require('../models/userModel.js');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const transporter=require('../config/nodeMailer.js');
const { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } = require('../config/emailTemplate.js');
require('dotenv').config();
const register=async(req,res)=>{
    const{name,emailId,password}=req.body;
    if(!name || !emailId || !password){
        return res.json({success:false,message:'missing details'})
    }

    try{
       const existingUser =await userModel.findOne({emailId});
       if(existingUser){
        return res.json({success:false,message:"user already exists"});
       }
       const hashPassword=await bcrypt.hash(password,10);
       const user =await userModel.create({name,emailId,password:hashPassword});

       const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
       
       res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV==='production'?'none':'strict',
        maxAge:7*24*60*60*1000
       });
       //sending welcome email to registered user
       const mailOptions={
          from:process.env.SENDER_EMAIL,
          to:emailId,
          subject:"Welcome to authentication project!",
          text:`you are successfully registered with emailId :${emailId}`
       }

       await transporter.sendMail(mailOptions);

       return res.json({success:true,message:"user registered"});

    }catch(error){
       res.json({success:false,message:error.message});
    }
}

const login=async(req,res)=>{
     const{emailId,password}=req.body;

     if(!emailId || !password){
        return res.json({success:false,message:'Email and password are required'});
     }
     try{
        const user=await userModel.findOne({emailId});
        if(!user){
           return res.json({success:false,message:'Invalid email'});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"Invalid password"})
        }
        
       const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
       
       res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV==='production'?'none':'strict',
        maxAge:7*24*60*60*1000
       });

       return res.json({success:true,message:"logged in"});

     }catch(error){
        res.json({success:false,message:error.message});
     }
}

const logout=async(req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict'
        })
      return res.json({success:true,message:"logged out"});
    }catch(error){
        return res.json({success:false,message:error.message});
    }
}

const sendVerifyOtp=async(req,res)=>{
    try{

        const userId=req.userId;

        const user=await userModel.findById(userId);
        if(!user){
        return  res.json({success:false,message:"user not found"});
        }
        if(user.isVerified){
           return res.json({success:false,message:"user is already verified"});
        }
        
        const otp=Math.floor(100000+Math.random() * 900000).toString();
        user.verifyOtp=otp;
        user.verifyOtpExpireAt=Date.now()+24*60*60*1000;
        await user.save();
        const mailOptions={
          from:process.env.SENDER_EMAIL,
          to:user.emailId,
          subject:"verification OTP",
        //   text:`verify your email using this otp : ${otp} `,
          html:EMAIL_VERIFY_TEMPLATE.replace("{{email}}",emailId).replace('{{otp}}',otp)
        }
        await transporter.sendMail(mailOptions);

        res.json({success:true,message:"Verification OTP sent to your registered emailId"});
    }catch(error){
        res.json({success:false,message:error.message});
    }
}

const verifyEmail=async(req,res)=>{
    const userId=req.userId;
    const {otp}=req.body;
    if(!userId || !otp){
        return res.json({success:false,message:"missing details"});
    }
    try{
        const user=await userModel.findById(userId);
        if(!user){
            return res.json({success:false,message:"user not found"})
        }

        if(user.verifyOtp===''  || user.verifyOtp!==otp){
            return res.json({success:false,message:"invalid otp"});
        }
        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success:true.valueOf,message:"OTP expired,try again!"});
        }
        user.isVerified=true;
        user.verifyOtp='';
        user.verifyOtpExpireAt=0;

        await user.save();

        return res.json({success:true,message:"User is successfully verified"})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}

const isAuthenticated=async(req,res)=>{
    try{
        res.json({success:true,message:"user is authenticated"});
    }catch(error){
        res.json({success:false,message:error.message});
    }
}
const sendResetPassword=async(req,res)=>{
    const {emailId}=req.body;

    if(!emailId){
        return res.json({success:false,message:"email is required"});
    }
    try{
      const user=await userModel.findOne({emailId});
      if(!user){
        return  res.json({success:false,message:"user not found"});
      }
      const otp=Math.floor(100000+Math.random() * 900000).toString();
        user.resetOtp=otp;
        user.resetOtpExpireAt=Date.now()+5*60*1000;
        await user.save();

        const mailOptions={
          from:process.env.SENDER_EMAIL,
          to:user.emailId,
          subject:"password reset OTP",
          html:PASSWORD_RESET_TEMPLATE.replace("{{email}}",emailId).replace('{{otp}}',otp)
        }
        await transporter.sendMail(mailOptions);
        
        res.json({success:true,message:"OTP sent to your email"});
    }catch(error){
         res.json({success:false,message:error.message});
    }
}

const verifyResetPassword=async(req,res)=>{
    const {emailId,newpassword,otp}=req.body;
    if(!emailId || !otp || !newpassword){
        return res.json({success:false,message:"all fields are required"});
    }
    try{
         const user=await userModel.findOne({emailId});
         if(!user){
            return res.json({success:false,message:"user not found"});
         }
         if(user.resetOtp==='' || user.resetOtp!==otp){
            return  res.json({success:false,message:"invalid otp"});
         }
         if(user.resetOtpExpireAt < Date.now()){
            return  res.json({success:false,message:"Password Reset OTP is expired"});
         }
         const isOld = await bcrypt.compare(newpassword, user.password);

         if(isOld){
            return  res.json({success:false,message:"password used previously"});
         }
         const hashedpassword=await bcrypt.hash(newpassword,10);
         user.password=hashedpassword;
         user.resetOtp='';
         user.resetOtpExpireAt=0;
         await user.save();

        res.json({success:true,message:"password reset successful"});
    }catch(error){
         res.json({success:false,message:error.message});
    }
}
module.exports={register,login,logout,sendVerifyOtp,verifyEmail,isAuthenticated,sendResetPassword,verifyResetPassword};