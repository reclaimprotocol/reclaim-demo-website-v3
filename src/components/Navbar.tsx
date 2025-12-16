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
        to="/attestor"
        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
      >
        Attestor Playground
      </NavLink>
    </nav>
  );
};
