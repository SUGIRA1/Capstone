import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

//internal import

import AuthServices from "../../services/authServices";
import { UserContext } from "../../context/UserContext";
import { notifyError, notifySuccess } from "../../utils/toast";

const useLoginSubmit = () => {
  const router = useRouter();
  const { dispatch } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const submitHandler = ({ name, email, password }) => {
    setLoading(true);
    const cookieTimeOut = 0.5;

    if (name && email && password) {
      AuthServices.clientRegister({
        name,
        email,
        password,
      })
        .then((res) => {
          setLoading(false);
          notifySuccess("Registration Success!");
          dispatch({ type: "USER_LOGIN", payload: res });
          Cookies.set("userInfo", JSON.stringify(res), {
            expires: cookieTimeOut,
          });

          router.push("/");
        })
        .catch((err) => {
          notifyError(
            err.response?.data.message ? err.response.data.message : err.message
          );
          setLoading(false);
        });
    } else {
      AuthServices.clientLogin({
        email,
        password,
      })
        .then((res) => {
          setLoading(false);
          notifySuccess("Login Success!");
          dispatch({ type: "USER_LOGIN", payload: res });
          Cookies.set("userInfo", JSON.stringify(res), {
            expires: cookieTimeOut,
          });

          router.push("/");
        })
        .catch((err) => {
          notifyError(
            err.response?.data.message ? err.response.data.message : err.message
          );
          setLoading(false);
        });
    }
  };

  return {
    handleSubmit,
    watch,
    submitHandler,
    register,
    errors,
    loading,
  };
};

export default useLoginSubmit;
