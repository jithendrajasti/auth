const jwt=require('jsonwebtoken');
require('dotenv').config();
const userAuth=async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
       return res.json({success:false,message:"Not authorised login again!"});
    }
    try{
      const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);
      if(tokenDecode.id){
        req.userId=tokenDecode.id;
      }
      else{
        return res.json({success:false,message:"Not authorised login again!"});
      }
      next();
    }catch(error){
        res.json({success:false,message:error.message});
    }
}

module.exports=userAuth;