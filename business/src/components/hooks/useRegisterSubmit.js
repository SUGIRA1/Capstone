import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

//internal import

import AuthServices from "../../services/authServices";
import { UserContext } from "../../context/UserContext";
import { notifyError, notifySuccess } from "../../utils/toast";

const useRegisterSubmit = (id) => {
  const router = useRouter();
  const { dispatch } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const submitHandler = (data) => {
    if (!imageUrl && !id) {
      notifyError("Image is required!");
      return;
    }

    const businessData = {
      name: data.name,
      email: data.email,
      rep: data.rep,
      description: data.description,
      pitchVideo: data.pitchVideo,
      minAmount: data.minAmount,
      goalAmount: data.goalAmount,
      password: data.password,
      image: imageUrl,
    };

    setLoading(true);
    const cookieTimeOut = 0.5;

    if (!id) {
      AuthServices.businessRegister({
        data: businessData,
      })
        .then((res) => {
          console.log("success");

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
      AuthServices.updateBusiness(id, {
        data: businessData,
      })
        .then((res) => {
          setLoading(false);
          notifySuccess("Updated successfully");
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
    imageUrl,
    setImageUrl,
  };
};

export default useRegisterSubmit;
