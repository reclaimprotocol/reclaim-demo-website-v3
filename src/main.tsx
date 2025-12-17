import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./routes.tsx";
import { RouterProvider } from "react-router";
import {
  LiveBackground,
  LiveBackgroundProvider,
} from "./components/LiveBackground.tsx";
import { ExpertContextProvider } from "./contexts/ExpertContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="root-bg">
      <LiveBackgroundProvider>
        <ExpertContextProvider>
          <LiveBackground>
            <RouterProvider router={router} />
          </LiveBackground>
        </ExpertContextProvider>
      </LiveBackgroundProvider>
    </div>
  </StrictMode>,
);
