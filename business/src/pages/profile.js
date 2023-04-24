import Head from "next/head";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

import Layout from "../layout/Layout";
import WithAuth from "../components/auth/WithAuth";
import useRegisterSubmit from "../components/hooks/useRegisterSubmit";
import Error from "../components/form/Error";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const Profile = ({ setUserInfo }) => {
  const {
    state: { userInfo },
  } = useContext(UserContext);

  const [imgLoading, setImgLoading] = useState(false);

  const [text, setText] = useState("");

  const {
    handleSubmit,
    submitHandler,
    register,
    errors,
    loading,
    imageUrl,
    setImageUrl,
  } = useRegisterSubmit(userInfo?._id);

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
    <Layout>
      <form
        className="auth-form businessreg-form"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h2>Edit Business Profile/Campaign</h2>
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
        <label htmlFor="rep">Company Rep</label>
        <input
          {...register(`rep`, {
            required: `Rep is required!`,
          })}
          type="text"
          name="rep"
          defaultValue={userInfo?.rep}
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
          value={text ? text : userInfo?.description}
          onChange={(e) => setText(e.target.value)}
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
          defaultValue={userInfo?.goalAmount}
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
          defaultValue={userInfo?.minAmount}
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
          defaultValue={userInfo?.pitchVideo}
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

          {!imageUrl && userInfo?.image && (
            <div>
              <img src={userInfo?.image} alt="Uploaded file" id="preview" />
            </div>
          )}
        </div>

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
