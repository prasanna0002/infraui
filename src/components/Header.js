import React, { Component } from "react";
import classNames from "classnames";

class Header extends Component {
  constructor(props) {
    super(props);
  }
  handleToggleMenu = () => {
    if (this.props.onClick) {
      this.props.onClick();
    }
  };
  render() {
    return (
      <header className="topbar is_stuck">
        <nav className="navbar top-navbar navbar-toggleable-sm navbar-light">
          <div className="navbar-header">
            <a className="navbar-brand">
              <b>
                <img
                  height="25px"
                  width="25px"
                  src="./styles/images/kubernetes_1.png"
                  alt="homepage"
                  className="light-logo"
                />
              </b>
              <b>
                <label className="system-abv">IIP</label>
              </b>
            </a>
          </div>
          <div className="navbar-collapse">
            <ul className="navbar-nav mr-auto mt-md-0">
              <li className="nav-item">
                <a
                  onClick={this.handleToggleMenu}
                  title={
                    this.props.isMenuHidden ? "Expand Menu" : "Collapse Menu"
                  }
                  className="nav-link nav-toggler text-muted waves-effect waves-dark"
                >
                  <i
                    className={classNames(
                      "mdi",
                      this.props.isMenuHidden
                        ? "mdi-fast-forward"
                        : "mdi-rewind"
                    )}
                  ></i>
                </a>
              </li>
              <li className="nav-item">
                <label className="system-header">
                  Infosys Infrastructure Platform
                </label>
              </li>
            </ul>
            <ul className="navbar-nav my-lg-0">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle text-muted waves-effect waves-dark"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <img
                    src="./styles/images/users/profile.png"
                    alt="user"
                    className="profile-pic m-r-10"
                  />
                  Administrator
                </a>
              </li>
            </ul>
            <ul className="navbar-nav my-lg-0">
              <li class="nav-item dropdown">
                <a 
                  title="Logout" 
                  className="nav-link dropdown-toggle text-muted waves-effect waves-dark" 
                  href="http://localhost:8082/auth/realms/IAC_realm/protocol/openid-connect/logout?redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F"
                  
                >
                  <i className="mdi mdi-power"></i>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}

export default Header;
