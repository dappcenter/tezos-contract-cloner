import React from "react";
import "./styles.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="left-container">
        <img alt="Built With Taquito logo" src="/built-with-taquito.png" />
      </div>
      <div className="right-container">
        <a href="https://github.com/ecadlabs/taquito">
          <img alt="Github logo" height="50" width="100" src="/github.jpg" />
        </a>
      </div>
    </div>
  );
};
export default Navbar;
