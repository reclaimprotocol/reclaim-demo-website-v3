import { useEffect } from "react";
import { useLiveBackground } from "../components/LiveBackground";
import SelectProviderForVerification from "../components/SelectProviderForVerification/index";
import WordLogo from "../components/logo/WordLogo";

function Page() {
  const { setStatus } = useLiveBackground();
  useEffect(() => {
    setStatus("idle");
  }, [setStatus]);

  return (
    <div className="container">
      <WordLogo />

      <p className="subheading">What do you want to verify?</p>

      <SelectProviderForVerification />
      <p className="disclaimer">
        This is a demo playground to explore use of @reclaimprotocol/js-sdk.{" "}
        <a
          href="https://docs.reclaimprotocol.org"
          className="link"
          target="_blank"
          rel="noreferrer"
        >
          Learn More
        </a>
      </p>
    </div>
  );
}

export default Page;
