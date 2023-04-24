import { useContext, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import WithAuth from "../components/auth/WithAuth";
import Error from "../components/form/Error";
import { UserContext } from "../context/UserContext";
import { useForm } from "react-hook-form";
import AuthServices from "../services/authServices";
import { notifyError, notifySuccess } from "../utils/toast";
import { useRouter } from "next/router";

const ChangePass = ({ setUserInfo }) => {
  const {
    state: { userInfo },
  } = useContext(UserContext);

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = ({ currentPassword, newPassword }) => {
    setLoading(true);
    AuthServices.changePassword({
      email: userInfo?.email,
      currentPassword,
      newPassword,
    })
      .then((res) => {
        setLoading(false);
        notifySuccess("Password changed successfully");
      })
      .catch((err) => {
        notifyError(
          err.response?.data.message ? err.response.data.message : err.message
        );
        setLoading(false);
      });
  };

  return (
    <Layout>
      <form
        className="auth-form businessreg-form"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h2>Change password</h2>
        <label htmlFor="currentPassword">Current Password</label>
        <input
          {...register(`currentPassword`, {
            required: `Current password is required!`,
          })}
          type="password"
          name="currentPassword"
          placeholder="Enter Current Password"
          required
        />
        <Error errorName={errors.currentPassword} />
        <label htmlFor="newPassword">New Password</label>
        <input
          {...register(`newPassword`, {
            required: `New password is required!`,
          })}
          type="password"
          name="newPassword"
          placeholder="Enter New Password"
          required
        />
        <Error errorName={errors.newPassword} />

        {loading ? (
          <p>loading ...</p>
        ) : (
          <button type="submit" className="Submit">
            Update
          </button>
        )}
      </form>
    </Layout>
  );
};

export default WithAuth(ChangePass);
