import React from "react";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import NavBar from "./navbar/NavBar";

const Layout = ({ children }) => {
  return (
    <>
      <ToastContainer />
      <Head>
        <title>Fiinanza</title>
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:400,600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <NavBar />
      {children}
    </>
  );
};

export default Layout;
