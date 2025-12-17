import { NavLink } from "react-router";

export const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink
        to="/"
        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        end
      >
        Home
      </NavLink>
      <NavLink
        to="/expert"
        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
      >
        Expert
      </NavLink>
      <NavLink
        to="/playground"
        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
      >
        Claim Playground
      </NavLink>
    </nav>
  );
};
