import Link from "next/link";
import React from "react";

const NotLoggedIn = ({ reference }) => {
  return (
    <>
      <p className="settings-desc">You must login to continue</p>
      <Link href={`/account/login?ref=${reference}`}>
        <a>
          <button className="btn-sm lg not-logged">Login</button>
        </a>
      </Link>
    </>
  );
};

export default NotLoggedIn;
