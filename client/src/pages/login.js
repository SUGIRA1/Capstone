import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Error from "../components/form/Error";
import useLoginSubmit from "../components/hooks/useLoginSubmit";
import AuthLayout from "../layout/AuthLayout";

const login = () => {
  const router = useRouter();

  useEffect(() => {
    if (Cookies.get("userInfo")) {
      router.push("/");
    }
  }, []);

  const { handleSubmit, submitHandler, register, errors, loading } =
    useLoginSubmit();

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={handleSubmit(submitHandler)}>
        <h2>Client Login</h2>
        <label htmlFor="email">Email</label>
        <input
          {...register(`email`, {
            required: `Email is required!`,
          })}
          type="email"
          name="email"
          placeholder="Enter your email"
          className="form-control"
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
          className="form-control"
          required
        />
        <Error errorName={errors.password} />
        {loading ? (
          <p>loading ...</p>
        ) : (
          <button type="submit" className="Submit">
            Login
          </button>
        )}

        <p className="form-extra">
          Don't have an account?{" "}
          <Link href="/register">
            <a>Register</a>
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default login;
