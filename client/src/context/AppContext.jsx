import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
export const AppContext=createContext();

export const AppContextProvider=(props)=>{
    const backendUrl="https://auth-37ye.onrender.com";
    const [isLoggedin,setIsLoggedin]=useState(false);
    const[userData,setUserData]=useState({});
    const getUserData=async()=>{
      try{
         axios.defaults.withCredentials=true;
         const {data}=await axios.get(backendUrl+'/api/user/getUser');
         data.success?setUserData(data.userData):toast.error(data.message);
      }catch(error){
        toast.error(error.message);
      }
    }
    const getAuthstate=async()=>{
      try{
        axios.defaults.withCredentials=true;
         const {data}=await axios.get(backendUrl+'/api/auth/isAuth');
         if(data.success){
          setIsLoggedin(true);
          getUserData();
         }
      }catch(error){
        toast.error(error.message)
      }
    }

    useEffect(()=>{
      getAuthstate();
    },[]);
     const value={
           backendUrl,
           isLoggedin,
           userData,setUserData,setIsLoggedin,getUserData
     }
      return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
      )
}
