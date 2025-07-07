const mongoose=require('mongoose');
require('dotenv').config();
const connectDB =async()=>{
    mongoose.connection.on('connected',()=>{
        console.log("data base connected");
    })
    await mongoose.connect(`${process.env.MONGODB_URL}mern-auth`);
}
module.exports=connectDB;