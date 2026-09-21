import React, { Fragment } from "react";
import Navbars from "./Navbars";
import { useTheme } from "../utils/ThemeProvider";

const Layout = ({ children, isBack }) => {
  const { theme } = useTheme();
  const bg = theme === 'dark' ? "#1a1a2e" : "#f0f2f5";
  const textColor = theme === 'light' ? "#e0e0e0" : "#212529";

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: bg,
        color: textColor,
        transition: "background 0.3s, color 0.3s",
      }}
    >
      <Navbars isBack={isBack} />

      <main
        style={{
          height: "100%",
          paddingTop: "55px",
          boxSizing: "border-box",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;