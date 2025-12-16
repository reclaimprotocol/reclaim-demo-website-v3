import wordLogo from "../../assets/word_icon.svg";
import { useIsLargeScreen } from "../../hooks/useIsLargeScreen";

export default function WordLogo() {
  const isMobile = !useIsLargeScreen();

  return (
    <div
      className="logo-container"
      style={{ marginTop: !isMobile ? "15vh" : "4vh" }}
    >
      <a href="https://reclaimprotocol.org" target="_blank" rel="noreferrer">
        <img
          src={wordLogo}
          alt="Reclaim Protocol"
          className="logo-icon"
          style={{ height: "40px", width: "auto" }}
        />
      </a>
    </div>
  );
}
