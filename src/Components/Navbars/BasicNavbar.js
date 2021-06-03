import React from "react";
import "../../App.scss";
import logo from "./logo.png";

import { useAuth0 } from "@auth0/auth0-react";

const BasicNavbar = (props) => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
      <a class="navbar-brand" href="/">
        <img
          src={logo}
          width="45"
          class="d-inline-block align-top"
          alt="sigma7"
        />
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li className="nav-item active">
            {isAuthenticated ? (
              <a className="nav-link" href={`dashboard/${user.sub}`}>
                Dashboard
              </a>
            ) : (
              <h1>loading</h1>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default BasicNavbar;
