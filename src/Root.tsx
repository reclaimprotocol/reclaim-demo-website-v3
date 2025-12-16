import { Outlet } from "react-router";
import { Navbar } from "./components/Navbar";

export default function Root() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
