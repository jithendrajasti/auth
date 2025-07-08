const express=require('express');
const cors=require('cors');
require('dotenv').config();
const cookieParser=require('cookie-parser');
const connectDB = require('./config/database');
const authRouter = require('./routes/authRoutes.js');
const userRouter = require('./routes/userRoutes.js');

const app=express();
const port=process.env.PORT || 4000;
connectDB();

const allowedOrigins=['https://auth-client-xl2s.onrender.com']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials:true}));
//API Endpoints
app.get('/',(req,res)=>{
    res.send('API working...');
})
app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)
app.listen(port,()=>{
    console.log(`server started on PORT:${port}`);
})
