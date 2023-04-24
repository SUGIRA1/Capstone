import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { UserContext } from "../../context/UserContext";

const WithAuth = (WrappedComponent) => {
  const AuthWrapper = (props) => {
    const { dispatch } = useContext(UserContext);
    const [userInfo, setUserInfo] = useState(null);
    const router = useRouter();
    useEffect(() => {
      if (Cookies.get("userInfo")) {
        setUserInfo(JSON.parse(Cookies.get("userInfo")));
      }
    }, []);

    const logout = () => {
      dispatch({ type: "USER_LOGOUT" });
      Cookies.remove("userInfo");
      setUserInfo(null);
      router.push("/login");
    };

    return (
      <WrappedComponent
        {...props}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        logout={logout}
      />
    );
  };

  return AuthWrapper;
};

export default WithAuth;
