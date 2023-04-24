import React from "react";
import Link from "next/link";
import WithAuth from "../../components/auth/WithAuth";

const NavBar = ({ userInfo, logout }) => {
  return (
    <header className="header">
      <div className="header-logo">
        <Link href="/">
          <a>Fiinanza</a>
        </Link>
      </div>

      {userInfo ? (
        <>
          <div className="header-dropdown">
            <div className="profile-img-container">
              <img
                src="/images/user-icon.svg"
                alt="Profile Picture"
                className="profile-picture"
              />
            </div>

            <i className="fas fa-chevron-down"></i>
            <div className="dropdown-content">
              <Link href="/investments">
                <a className="header-menu-item">Investments</a>
              </Link>
              <hr />
              <Link href="/profile">
                <a className="header-menu-item">Edit Profile</a>
              </Link>
              <hr />
              <p onClick={logout}>Logout</p>
            </div>
          </div>
        </>
      ) : (
        <div className="header-buttons">
          <Link href="/register">
            <a className="button button--secondary">Signup</a>
          </Link>
          <Link href="/login">
            <a className="button">Login</a>
          </Link>
        </div>
      )}
    </header>
  );
};

export default WithAuth(NavBar);
