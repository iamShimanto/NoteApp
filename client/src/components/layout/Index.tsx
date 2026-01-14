import { useEffect } from "react";
import { Outlet } from "react-router";
import { authServices } from "../../api/auth.services";
import { useDispatch, useSelector } from "react-redux";
import { loggedUser } from "../../store/slices/authSlice";
import axios from "axios";
import toast from "react-hot-toast";

const Layout = () => {

  const dispatch = useDispatch()
  const userInfo = useSelector((state : any)=> state.userData && state.userData.user)
 

  useEffect(()=>{
    (async ()=>{
      try {
        const res = await authServices.profile()
        console.log(res)
        dispatch(loggedUser(res.user))
      } catch (error) {
        console.log(error)
         if(axios.isAxiosError(error)){
        toast.error(error?.response?.data?.message)
      }
      }
    })()
  },[])


  return (
    <>
      <Outlet />
    </>
  );
};

export default Layout;
