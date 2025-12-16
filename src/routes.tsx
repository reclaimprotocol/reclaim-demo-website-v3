import RootErrorBoundary from "./app/error";
import { createBrowserRouter } from "react-router";
import Root from "./Root";
import AppPage from "./app/page";
import ExpertPage from "./app/expert/page";
import AttestorPage from "./app/attestor/page";
import VerifyPage from "./app/verify/page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    ErrorBoundary: RootErrorBoundary,
    children: [
      { index: true, Component: AppPage },
      { path: "verify", Component: VerifyPage },
      { path: "expert", Component: ExpertPage },
      { path: "attestor", Component: AttestorPage },
    ],
  },
]);
