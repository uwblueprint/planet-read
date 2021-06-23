import React from "react";
import Logo from "../../assets/planet-read-logo.png";
import PlaceholderUserIcon from "../../assets/user-icon.png";
import "./Header.css";

type HeaderProps = {
  currentPageTitle: string;
};

const Header = ({ currentPageTitle }: HeaderProps) => {
  return (
    <div className="header-bar">
      <div className="header-information">
        <img id="header-logo" src={Logo} alt="Planet READ logo" />
        <h1>{currentPageTitle}</h1>
      </div>
      {/* TODO: this is not real */}
      <img id="header-user-icon" src={PlaceholderUserIcon} alt="User icon" />
    </div>
  );
};

export default Header;
