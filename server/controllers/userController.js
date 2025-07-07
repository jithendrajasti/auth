const userModel=require('../models/userModel.js')

const getUserData=async(req,res)=>{
    try{
         const userId =req.userId;
         const user=await userModel.findById(userId);
         if(!user){
            return  res.json({success:false,message:"user not found"});
         }
         res.json({
            success:true,
            message:"user found",
            userData:{
                name:user.name,
                isVerified:user.isVerified
            }
        })
    }catch(error){
        res.json({success:false,message:error.message})
    }
}

module.exports=getUserData;