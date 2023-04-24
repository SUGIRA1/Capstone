import React from "react";
import Layout from "../layout/Layout";

const NotFound = () => {
  return (
    <Layout>
      <main className="hero">
      <div className="container success-container">
        <div className="success-conf">
          <h3 className="title-404">404</h3>
          <p>The page you are looking for doesn't exist</p>
        </div>
      </div>
    </main>
    </Layout>
  );
};

export default NotFound;
