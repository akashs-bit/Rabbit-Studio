import React from "react";
import Topbar from "../Layout/Topbar";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <>
    <header className="border-b border-gray-300">
      {/* Top bar */}
      <Topbar/>
      {/* navbar */}
      <Navbar/>
      {/* Cart Drawer */}
      </header>
    </>
  );
};

export default Header;
