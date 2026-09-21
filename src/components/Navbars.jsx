import { useTheme } from "../utils/ThemeProvider";
import { Button, Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

const Navbars = ({ isBack = false }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navs = [
    { name: "Home", url: "/" },
    { name: "Album", url: "/album" },
    { name: "Artist", url: "/artist" },
  ];

  return (
    <Navbar
        expand="lg"
        style={{ background: theme === "light" ? "#0f0f1a" : "#1a1a2e", flexShrink: 0 }}
        className="px-3 py-2 shadow px-5 border-2 border-bottom fixed-top"
        data-bs-theme="dark"
      >
        {isBack && (
          <Nav className="me-5">
            <NavLink onClick={() => navigate(-1)} className={"nav-link fs-4 text-white"}>
              ←
            </NavLink>
          </Nav>
        )}
        <Navbar.Brand href="#" className="fw-bold fs-5" style={{ color: "#fff", letterSpacing: 1 }}>
          VocaSV
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" style={{ borderColor: "#555" }} />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-center gap-2">
            {navs?.map((item) => (
                <NavLink className={'nav-link'} key={item.name} to={item.url}>{item.name}</NavLink>
            ))}
            <Button
              size="sm"
              variant="outline-light"
              onClick={toggleTheme}
              style={{ borderRadius: 20, fontSize: 13, padding: "4px 14px" }}
            >
              {theme === "light" ? "☀ Dark" : "💡 Light"}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
  );
};

export default Navbars;
