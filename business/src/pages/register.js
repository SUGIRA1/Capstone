import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Error from "../components/form/Error";
import Layout from "../layout/Layout";
import useRegisterSubmit from "../components/hooks/useRegisterSubmit";
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
  } = useRegisterSubmit();

  useEffect(() => {
    if (Cookies.get("userInfo")) {
      router.push("/");
    }
  }, []);

  const cloudName = "dmjz1r5ek";
  const unsignedUploadPreset = "mc5jxrb6";

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImgLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", unsignedUploadPreset);

    axios
      .post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, formData)
      .then((response) => {
        setImgLoading(false);
        setImageUrl(response.data.secure_url);
      })
      .catch((error) => {
        setImgLoading(false);
        console.error(error);
      });
  };

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={handleSubmit(submitHandler)}>
        <h2>Business Register</h2>
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
        <label htmlFor="rep">Company Rep</label>
        <input
          {...register(`rep`, {
            required: `Rep is required!`,
          })}
          type="text"
          name="rep"
          placeholder="Enter rep name"
          required
        />
        <Error errorName={errors.rep} />

        <label for="description">Company Description</label>
        <textarea
          {...register("description", {
            required: "Description is required!",
          })}
          id="companyDesc"
          name="description"
          rows="10"
          required
        ></textarea>
        <Error errorName={errors.description} />

        <label htmlFor="goal">Goal Amount</label>
        <input
          {...register(`goalAmount`, {
            required: `goalAmount is required!`,
          })}
          type="number"
          name="goalAmount"
          placeholder="Target amount"
          required
        />
        <Error errorName={errors.goalAmount} />

        <label htmlFor="minAmount">Min Amount</label>
        <input
          {...register(`minAmount`, {
            required: `Min Amount is required!`,
          })}
          type="number"
          name="minAmount"
          placeholder="Min amount"
          required
        />
        <Error errorName={errors.minAmount} />

        <label htmlFor="pitchVideo">Pitch Video</label>
        <input
          {...register(`pitchVideo`, {
            required: `video is required!`,
          })}
          type="text"
          name="pitchVideo"
          placeholder="Please use youtube embed link"
          required
        />

        <Error errorName={errors.pitchVideo} />

        <div>
          <label htmlFor="image">Image:</label>
          <input type="file" onChange={handleFileChange} />
          {imgLoading && <div>Loading...</div>}
          {imageUrl && (
            <div>
              <img src={imageUrl} alt="Uploaded file" id="preview" />
            </div>
          )}
        </div>

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
