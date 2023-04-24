import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Error from "../components/form/Error";
import useLoginSubmit from "../components/hooks/useLoginSubmit";
import axios from "axios";
import AuthLayout from "../layout/AuthLayout";

const register = () => {
  const router = useRouter();
  const [imgLoading, setImgLoading] = useState(false);

  const {
    handleSubmit,
    submitHandler,
    register,
    errors,
    loading,
    imageUrl,
    setImageUrl,
  } = useLoginSubmit();

  useEffect(() => {
    if (Cookies.get("userInfo")) {
      router.push("/");
    }
  }, []);

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={handleSubmit(submitHandler)}>
        <h2>Client Register</h2>
        <label htmlFor="name">Name</label>
        <input
          {...register(`name`, {
            required: `Name is required!`,
          })}
          type="text"
          name="name"
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
          placeholder="Enter your email"
          required
        />
        <Error errorName={errors.email} />

        <label htmlFor="password">Password</label>
        <input
          {...register(`password`, {
            required: `Password is required!`,
          })}
          type="password"
          name="password"
          placeholder="Your password"
          required
        />
        <Error errorName={errors.password} />
        {loading ? (
          <p>loading ...</p>
        ) : (
          <button type="submit" className="Submit">
            Register
          </button>
        )}

        <p className="form-extra">
          Have an account?{" "}
          <Link href="/login">
            <a>Login</a>
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default register;
