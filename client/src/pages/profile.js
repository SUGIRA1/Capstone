import Head from "next/head";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

import Layout from "../layout/Layout";
import WithAuth from "../components/auth/WithAuth";
import Error from "../components/form/Error";
import { UserContext } from "../context/UserContext";
import { useForm } from "react-hook-form";
import AuthServices from "../services/authServices";
import Cookies from "js-cookie";
import { notifyError, notifySuccess } from "../utils/toast";
import { useRouter } from "next/router";

const Profile = ({ setUserInfo }) => {
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

  const submitHandler = ({ name, email }) => {
    setLoading(true);
    const cookieTimeOut = 0.5;

    AuthServices.updateClient(userInfo?._id, {
      name,
      email,
    })
      .then((res) => {
        setLoading(false);
        notifySuccess("Updated successfully");
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
  };

  return (
    <Layout>
      <form
        className="auth-form businessreg-form"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h2>Edit Profile</h2>
        <label htmlFor="name">Name</label>
        <input
          {...register(`name`, {
            required: `Name is required!`,
          })}
          type="text"
          name="name"
          defaultValue={userInfo?.name}
          placeholder="Enter Name"
          required
        />
        <Error errorName={errors.name} />
        <label htmlFor="email">Email</label>
        <input
          {...register(`email`, {
            required: `Email is required!`,
          })}
          type="email"
          name="email"
          defaultValue={userInfo?.email}
          placeholder="Enter your email"
          required
        />
        <Error errorName={errors.email} />

        <Link href="/changepass">
          <a class="change-pass-link">Change password?</a>
        </Link>

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

export default WithAuth(Profile);
