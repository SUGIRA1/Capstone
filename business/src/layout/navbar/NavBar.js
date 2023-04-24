import React from "react";
import Link from "next/link";
import WithAuth from "../../components/auth/WithAuth";

const NavBar = ({ userInfo, logout }) => {
  return (
    <header className="header">
      <div className="header-logo">Fiinanza Business</div>

      {userInfo && (
        <>
          <nav className="header-menu">
            <Link href="/">
              <a className="header-menu-item">Dashboard</a>
            </Link>
            <Link href="/investments">
              <a className="header-menu-item">Investments</a>
            </Link>
            <Link href="/investors">
              <a className="header-menu-item">Investors</a>
            </Link>
          </nav>

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
              <Link href="/profile">
                <a className="header-menu-item">profile</a>
              </Link>
              <hr />
              <p onClick={logout}>Logout</p>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default WithAuth(NavBar);
