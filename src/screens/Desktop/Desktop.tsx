import {
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import QRCode from "react-qr-code";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";

interface Logo {
  className?: string;
  alt: string;
  src: string;
}

interface LogoScrollerProps {
  companyLogos: Logo[];
}

const getProviderDetails = async (providerId: string) => {
  try {
    const response = await fetch(
      `https://api.reclaimprotocol.org/api/providers/${providerId}`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-GB,en;q=0.6",
        },
        body: null,
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const name = data.providers.name;
    const logoUrl = data.providers.logoUrl;
    return { name, logoUrl, providerId };
  } catch (error) {
    console.error("Error fetching provider details:", error);
    throw error;
  }
};

const LogoScroller: React.FC<LogoScrollerProps> = ({ companyLogos }) => {
  return (
    <div className="w-full overflow-hidden py-1 fixed bottom-0">
      <div className="flex justify-center items-center whitespace-nowrap gap-10 animate-logo-scroll">
        {[...companyLogos, ...companyLogos].map((logo, index) => (
          <img
            key={`logo-${index}`}
            className={`${logo.className ?? ""} scale-50 sm:scale-75`}
            alt={logo.alt}
            src={logo.src}
          />
        ))}
      </div>

      {/* Inline animation style */}
      <style>{`
  @keyframes logoScroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .animate-logo-scroll {
    animation: logoScroll 20s linear infinite;
  }

  @media (max-width: 768px) {
    .animate-logo-scroll {
      animation-duration: 10s;
    }
  }
`}</style>
    </div>
  );
};

export const Desktop = (): JSX.Element => {
  const [selectedSource, setSelectedSource] = useState<string | undefined>(
    undefined
  );
  const [customProviderId, setCustomProviderId] = useState("");
  const [requestUrl, setRequestUrl] = useState("");
  const [proofs, setProofs] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [providerName, setProviderName] = useState<string>("");
  const [providerIcon, setProviderIcon] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loadingState, setLoadingState] = useState<{
    type: "none" | "provider" | "custom";
    step: "fetching" | "generating" | "none";
  }>({ type: "none", step: "none" });

  // Check if device is mobile on component mount
  useEffect(() => {
    const checkMobile =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        navigator.userAgent.toLowerCase()
      ) ||
      (typeof window.orientation !== "undefined" ? window.orientation : -1) >
        -1;
    setIsMobile(checkMobile);
  }, []);

  // Data for the data sources to map over
  const dataSources = [
    {
      name: "X user profile",
      icon: <TwitterIcon className="w-[18px] h-[18px]" />,
      providerId: "e6fe962d-8b4e-4ce5-abcc-3d21c88bd64a",
    },
    {
      name: "Coinbase KYC",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.2"
          baseProfile="tiny"
          id="Layer_1"
          x="0px"
          y="0px"
          viewBox="0 0 1024 1024"
          overflow="visible"
          xmlSpace="preserve"
          className="w-[18px] h-[18px]"
        >
          <path
            fill="#0052FF"
            d="M512,0L512,0c282.8,0,512,229.2,512,512l0,0c0,282.8-229.2,512-512,512l0,0C229.2,1024,0,794.8,0,512l0,0  C0,229.2,229.2,0,512,0z"
          />
          <path
            fill="#FFFFFF"
            d="M512.1,692c-99.4,0-180-80.5-180-180s80.6-180,180-180c89.1,0,163.1,65,177.3,150h181.3  c-15.3-184.8-170-330-358.7-330c-198.8,0-360,161.2-360,360s161.2,360,360,360c188.7,0,343.4-145.2,358.7-330H689.3  C675,627,601.2,692,512.1,692z"
          />
        </svg>
      ),
      providerId: "285a345c-c6a6-4b9f-9e1e-23432082c0a8",
    },
    {
      name: "Github username",
      icon: <GithubIcon className="w-[18px] h-[18px]" />,
      providerId: "6d3f6753-7ee6-49ee-a545-62f1b1822ae5",
    },
    {
      name: "Gmail Account",
      icon: (
        <div className="w-[18px] h-[18px] bg-[url(/group-1.png)] bg-[100%_100%]" />
      ),
      providerId: "f9f383fd-32d9-4c54-942f-5e9fda349762",
    },
    {
      name: "Youtube Creator Analytics",
      icon: <YoutubeIcon className="w-[18px] h-[18px]" />,
      providerId: "f826e0b5-bb4d-4a85-b64c-2cd5c148657e",
    },
    {
      name: "Steam Counter Strike Inventory",
      icon: (
        <img
          src="https://devtool-images.s3.ap-south-1.amazonaws.com/http-provider-brand-logos/steampowered.com-ba4366e5-2dae-4611-9819-6f12cd452583.png"
          alt="Steam"
          className="w-[18px] h-[18px]"
        />
      ),
      providerId: "835cfd84-4096-4b3b-a547-4938686e9c5e",
    },
    {
      name: "LinkedIn user profile",
      icon: <LinkedinIcon className="w-[18px] h-[18px]" />,
      providerId: "e3b24f7a-92d1-4b9c-bf4d-7a6f21c3d918",
    },
    {
      name: "Amazon Last 2 order details",
      icon: (
        <img src="/amazon.ico" alt="Amazon" className="w-[18px] h-[18px]" />
      ),
      providerId: "bcaa6b6b-632f-43ec-8de5-c7cc9113aacd",
    },
    {
      name: "Swiggy Order analytics",
      icon: (
        <svg
          className="w-[18px] h-[18px]"
          xmlns="http://www.w3.org/2000/svg"
          height="2500"
          viewBox="-7.3 3.6 2520.1 3702.8"
          width="1708"
        >
          <path
            d="m1255.2 3706.3c-2.4-1.7-5-4-7.8-6.3-44.6-55.3-320.5-400.9-601.6-844.2-84.4-141.2-139.1-251.4-128.5-279.9 27.5-74.1 517.6-114.7 668.5-47.5 45.9 20.4 44.7 47.3 44.7 63.1 0 67.8-3.3 249.8-3.3 249.8 0 37.6 30.5 68.1 68.2 68 37.7 0 68.1-30.7 68-68.4l-.7-453.3h-.1c0-39.4-43-49.2-51-50.8-78.8-.5-238.7-.9-410.5-.9-379 0-463.8 15.6-528-26.6-139.5-91.2-367.6-706-372.9-1052-7.5-488 281.5-910.5 688.7-1119.8 170-85.6 362-133.9 565-133.9 644.4 0 1175.2 486.4 1245.8 1112.3 0 .5 0 1.2.1 1.7 13 151.3-820.9 183.4-985.8 139.4-25.3-6.7-31.7-32.7-31.7-43.8-.1-115-.9-438.8-.9-438.8-.1-37.7-30.7-68.1-68.4-68.1-37.6 0-68.1 30.7-68.1 68.4l1.5 596.4c1.2 37.6 32.7 47.7 41.4 49.5 93.8 0 313.1-.1 517.4-.1 276.1 0 392.1 32 469.3 90.7 51.3 39.1 71.1 114 53.8 211.4-154.9 866-1135.9 1939.1-1172.8 1983.8z"
            fill="#fc8019"
          />
        </svg>
      ),
      providerId: "e7da584e-7353-4b88-a51d-3fc8abc332f0",
    },
    {
      name: "Zomato Order analytics",
      icon: (
        <img src="/zomato.webp" alt="Zomato" className="w-[18px] h-[18px]" />
      ),
      providerId: "61fea293-73bc-495c-9354-c2f61294fcaf",
    },
    // {
    //   name: "Swiggy Order history",
    //   icon: (
    //     <svg
    //       className="w-[18px] h-[18px]"
    //       xmlns="http://www.w3.org/2000/svg"
    //       height="2500"
    //       viewBox="-7.3 3.6 2520.1 3702.8"
    //       width="1708"
    //     >
    //       <path
    //         d="m1255.2 3706.3c-2.4-1.7-5-4-7.8-6.3-44.6-55.3-320.5-400.9-601.6-844.2-84.4-141.2-139.1-251.4-128.5-279.9 27.5-74.1 517.6-114.7 668.5-47.5 45.9 20.4 44.7 47.3 44.7 63.1 0 67.8-3.3 249.8-3.3 249.8 0 37.6 30.5 68.1 68.2 68 37.7 0 68.1-30.7 68-68.4l-.7-453.3h-.1c0-39.4-43-49.2-51-50.8-78.8-.5-238.7-.9-410.5-.9-379 0-463.8 15.6-528-26.6-139.5-91.2-367.6-706-372.9-1052-7.5-488 281.5-910.5 688.7-1119.8 170-85.6 362-133.9 565-133.9 644.4 0 1175.2 486.4 1245.8 1112.3 0 .5 0 1.2.1 1.7 13 151.3-820.9 183.4-985.8 139.4-25.3-6.7-31.7-32.7-31.7-43.8-.1-115-.9-438.8-.9-438.8-.1-37.7-30.7-68.1-68.4-68.1-37.6 0-68.1 30.7-68.1 68.4l1.5 596.4c1.2 37.6 32.7 47.7 41.4 49.5 93.8 0 313.1-.1 517.4-.1 276.1 0 392.1 32 469.3 90.7 51.3 39.1 71.1 114 53.8 211.4-154.9 866-1135.9 1939.1-1172.8 1983.8z"
    //         fill="#fc8019"
    //       />
    //     </svg>
    //   ),
    //   providerId: "385b8e17-467d-4814-95b7-cbe58118c13e",
    // },
    // {
    //   name: "Zomato Order history",
    //   icon: (
    //     <img src="/zomato.webp" alt="Zomato" className="w-[18px] h-[18px]" />
    //   ),
    //   providerId: "61fea293-73bc-495c-9354-c2f61294fc30",
    // },
    {
      name: "Flipkart Order history",
      icon: (
        <img src="/image-5.png" alt="Flipkart" className="w-[18px] h-[18px]" />
      ),
      providerId: "29495787-4142-47be-a6fc-f3d4530c33da",
    },
    {
      name: "Spotify user-artist overview",
      icon: (
        <img
          src="https://devtool-images.s3.ap-south-1.amazonaws.com/http-provider-brand-logos/spotify.com-3d4ce35c-312a-4303-95ed-64387d6c00b3.png"
          alt="Spotify"
          className="w-[18px] h-[18px]"
        />
      ),
      providerId: "f395c58c-9b19-4623-8887-c8599c7996cf",
    },
    {
      name: "LinkedIn verifications",
      icon: <LinkedinIcon className="w-[18px] h-[18px]" />,
      providerId: "2c636fe2-4859-4e1f-8411-9e9d270b4675",
    },
  ];

  // Data for company logos to map over
  const companyLogos = [
    {
      src: "/company-logo-2.svg",
      alt: "Company logo",
      className: "relative w-[17px] h-12",
    },
    {
      src: "/company-logo-1.svg",
      alt: "Company logo",
      className: "w-[110px] relative h-12",
    },
    {
      src: "/company-logo-3.svg",
      alt: "Company logo",
      className: "w-[72px] relative h-12",
    },
    {
      src: "/company-logo.svg",
      alt: "Company logo",
      className: "w-[127px] relative h-12",
    },
    { src: "/image-6.png", alt: "Image", className: "relative w-[57px] h-14" },
    { src: "/image-5.png", alt: "Image", className: "relative w-12 h-[49px]" },
    { src: "/image-4.png", alt: "Image", className: "relative w-12 h-12" },
    { src: "/image-3.png", alt: "Image", className: "relative w-[47px] h-12" },
    {
      src: "/image-2.png",
      alt: "Image",
      className: "relative w-[55px] h-[46px]",
    },
    { src: "/image-7.png", alt: "Image", className: "relative w-24 h-[23px]" },
    { src: "/image-8.png", alt: "Image", className: "relative w-14 h-[39px]" },
    {
      src: "/image-9.png",
      alt: "Image",
      className: "relative w-[51px] h-[50px]",
    },
    { src: "/image-1.png", alt: "Image", className: "relative w-[39px] h-14" },
    {
      src: "/image-10.png",
      alt: "Image",
      className: "relative w-[90px] h-[35px]",
    },
    {
      src: "/image-11.png",
      alt: "Image",
      className: "relative w-[52px] h-[50px]",
    },
  ];

  // Handle source selection
  const handleSourceSelect = (value: string) => {
    setSelectedSource(value);
    setCustomProviderId("");
    setProviderName("");
    setProviderIcon("");
    setErrorMessage("");
    setRequestUrl("");
    setLoadingState({ type: "provider", step: "generating" });
    setProofs([]);
  };

  // Find the selected data source
  const selectedDataSource = selectedSource
    ? dataSources.find(
        (source) =>
          source.name.toLowerCase().replace(/\s+/g, "-") === selectedSource
      )
    : undefined;

  // Effect to automatically generate verification request when source changes
  useEffect(() => {
    if (selectedDataSource) {
      getVerificationReq();
    }
  }, [selectedSource]);

  const getVerificationReq = async () => {
    if (!selectedDataSource) return;

    setLoadingState({ type: "provider", step: "generating" });
    try {
      // Your credentials from the Reclaim Developer Portal
      // Replace these with your actual credentials
      const APP_ID = import.meta.env.VITE_RECLAIM_APP_ID || "";
      const APP_SECRET = import.meta.env.VITE_RECLAIM_APP_SECRET || "";
      const PROVIDER_ID = selectedDataSource.providerId;
      // Check if device is mobile
      const isMobile =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          navigator.userAgent.toLowerCase()
        ) ||
        (typeof window.orientation !== "undefined" ? window.orientation : -1) >
          -1;

      // Check if device is iOS
      const isIOS =
        /mac|iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase()) ||
        false;

      // Determine device type
      const deviceType = isMobile ? (isIOS ? "ios" : "android") : "desktop";

      // Initialize the Reclaim SDK with your credentials
      const reclaimProofRequest = await ReclaimProofRequest.init(
        APP_ID,
        APP_SECRET,
        PROVIDER_ID,
        {
          device: deviceType,
          useAppClip: deviceType !== "desktop",
        }
      );
      // Generate the verification request URL
      const requestUrl = await reclaimProofRequest.getRequestUrl();
      console.log("Request URL:", requestUrl);
      setRequestUrl(requestUrl);
      setLoadingState({ type: "none", step: "none" });

      // Start listening for proof submissions
      await reclaimProofRequest.startSession({
        // Called when the user successfully completes the verification
        onSuccess: (proofs) => {
          if (proofs) {
            if (typeof proofs === "string") {
              // When using a custom callback url, the proof is returned to the callback url and we get a message instead of a proof
              console.log("SDK Message:", proofs);
              setProofs([proofs]);
            } else if (typeof proofs !== "string") {
              // When using the default callback url, we get a proof object in the response
              if (Array.isArray(proofs)) {
                // when using provider with multiple proofs, we get an array of proofs
                console.log(
                  "Verification success",
                  JSON.stringify(proofs.map((p) => p.claimData.context))
                );
                setProofs(proofs);
              } else {
                // when using provider with a single proof, we get a single proof object
                console.log("Verification success", proofs?.claimData.context);
                setProofs([proofs]);
              }
            }
          }
          // Add your success logic here, such as:
          // - Updating UI to show verification success
          // - Storing verification status
          // - Redirecting to another page
        },
        // Called if there's an error during verification
        onError: (error) => {
          console.error("Verification failed", error);
          setErrorMessage(
            error instanceof Error
              ? error.message.split(": ")[1]
              : "An unknown error occurred"
          );
          setLoadingState({ type: "none", step: "none" });

          // Add your error handling logic here, such as:
          // - Showing error message to user
          // - Resetting verification state
          // - Offering retry options
        },
      });
    } catch (error) {
      console.error("Error generating verification request:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message.split(": ")[1]
          : "An unknown error occurred"
      );
      setLoadingState({ type: "none", step: "none" });
    }
  };

  const copyProofsToClipboard = () => {
    const proofString = JSON.stringify(proofs, null, 2);
    navigator.clipboard.writeText(proofString);
    alert("Proofs copied to clipboard!");
  };

  const handleOpenLink = () => {
    if (requestUrl) {
      window.open(requestUrl, "_blank");
    }
  };

  // Add new function for handling custom provider verification
  const handleCustomProviderSubmit = async () => {
    if (!customProviderId) return;
    setRequestUrl("");
    setProviderName("");
    setProviderIcon("");
    setErrorMessage("");
    setProofs([]);

    setLoadingState({ type: "custom", step: "fetching" });
    setErrorMessage(""); // Clear any previous errors
    try {
      const details = await getProviderDetails(customProviderId);
      setProviderName(details.name);
      setProviderIcon(details.logoUrl);
      console.log(details);

      setLoadingState({ type: "custom", step: "generating" });

      // Initialize verification with custom provider
      const APP_ID = import.meta.env.VITE_RECLAIM_APP_ID || "";
      const APP_SECRET = import.meta.env.VITE_RECLAIM_APP_SECRET || "";

      const isMobile =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          navigator.userAgent.toLowerCase()
        ) ||
        (typeof window.orientation !== "undefined" ? window.orientation : -1) >
          -1;

      const isIOS =
        /mac|iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase()) ||
        false;
      const deviceType = isMobile ? (isIOS ? "ios" : "android") : "desktop";

      const reclaimProofRequest = await ReclaimProofRequest.init(
        APP_ID,
        APP_SECRET,
        customProviderId,
        {
          device: deviceType,
          useAppClip: deviceType !== "desktop",
        }
      );

      const requestUrl = await reclaimProofRequest.getRequestUrl();
      console.log("Request URL:", requestUrl);
      setLoadingState({ type: "none", step: "none" });
      setRequestUrl(requestUrl);

      await reclaimProofRequest.startSession({
        onSuccess: (proofs) => {
          if (proofs) {
            if (typeof proofs === "string") {
              console.log("SDK Message:", proofs);
              setProofs([proofs]);
            } else if (typeof proofs !== "string") {
              if (Array.isArray(proofs)) {
                console.log(
                  "Verification success",
                  JSON.stringify(proofs.map((p) => p.claimData.context))
                );
                setProofs(proofs);
              } else {
                console.log("Verification success", proofs?.claimData.context);
                setProofs([proofs]);
              }
            }
          }
          setLoadingState({ type: "none", step: "none" });
        },
        onError: (error) => {
          console.error("Verification failed", error);
          setErrorMessage("Verification failed. Please try again.");
          setLoadingState({ type: "none", step: "none" });
        },
      });
    } catch (error) {
      console.error("Error with custom provider:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message.includes("HTTP error! status: 404")
            ? "Provider not found. Please recheck the provider ID."
            : error.message.split(": ")[1]
          : "An unknown error occurred"
      );
      setLoadingState({ type: "none", step: "none" });
      // Clear provider details on error
      setProviderName("");
      setProviderIcon("");
    }
  };

  return (
    <main className="bg-white flex flex-row justify-center w-full min-h-screen overflow-y-auto">
      <div className="bg-white [background:radial-gradient(50%_50%_at_-108%_112%,rgba(0,0,238,1)_0%,rgba(255,255,255,1)_100%)] w-full relative pb-20">
        <div className="w-full max-w-[1347px] mx-auto relative pt-6 px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Blue glow effect */}
            <div className="absolute w-[250px] sm:w-[300px] md:w-[395px] h-[250px] sm:h-[300px] md:h-[395px] top-0 right-0 bg-[#0000ee] rounded-[197.5px] blur-[250px]" />
            <div className="absolute w-[250px] sm:w-[300px] md:w-[395px] h-[250px] sm:h-[300px] md:h-[395px] top-0 left-0 bg-[#0000ee] rounded-[197.5px] blur-[250px]" />

            {/* Logo */}
            <img
              className="w-[120px] sm:w-[150px] md:w-[174px] h-auto mx-auto mb-4 sm:mb-6 md:mb-8"
              alt="Reclaim Logo"
              src="/vector.svg"
            />

            {/* Main content */}
            <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-[30px] w-full max-w-[1043px] mx-auto">
              <header className="flex flex-col items-center justify-center relative self-stretch w-full flex-[0_0_auto]">
                <h1 className="relative w-fit mt-[-1.00px] font-['Poppins',Helvetica] font-bold text-[#0000ee] text-3xl sm:text-4xl md:text-5xl lg:text-[64px] text-center tracking-[0] leading-[normal]">
                  Reclaim Protocol Demo
                </h1>

                <p className="relative w-fit font-['Poppins',Helvetica] font-normal text-[#0000ee] text-sm sm:text-base md:text-lg text-center tracking-[0] leading-[normal] mt-2 px-4">
                  Proofs generated by Reclaim Protocol are secure and private.{" "}
                  <a href="#" className="text-[#0000ee] underline">
                    Learn More
                  </a>
                </p>
              </header>

              {/* Data source selector */}
              <div className="flex flex-col items-center gap-2 w-full max-w-[90%] sm:max-w-[400px] md:max-w-[524px]">
                <Select
                  onValueChange={handleSourceSelect}
                  value={selectedSource}
                >
                  <SelectTrigger className="h-[50px] rounded-[10px] border-none font-['Karla',Helvetica] font-normal text-black text-base sm:text-lg md:text-xl w-full bg-[#ffffff] z-10">
                    <SelectValue placeholder="Select data source" />
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2"
                    >
                      <path
                        d="M1 1.5L6 6.5L11 1.5"
                        stroke="black"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </SelectTrigger>
                  <SelectContent className="rounded-[10px]">
                    <div
                      className="relative h-[220px] overflow-y-scroll pr-3 scrollbar"
                      style={{ scrollbarWidth: "auto", overflowY: "scroll" }}
                    >
                      <div className="py-2">
                        {dataSources.map((source, index) => (
                          <SelectItem
                            key={index}
                            value={source.name
                              .toLowerCase()
                              .replace(/\s+/g, "-")}
                            className="flex items-center h-[42px] cursor-pointer"
                          >
                            <div className="flex items-center">
                              <span className="mr-3">{source.icon}</span>
                              <span className="font-['Poppins',Helvetica] font-normal text-black text-sm">
                                {source.name}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                        <a
                          href="https://dev.reclaimprotocol.org"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-8 py-3 text-sm text-[#0000ee] hover:bg-slate-50 transition-colors"
                        >
                          +1500 Providers
                        </a>
                      </div>
                    </div>
                  </SelectContent>
                </Select>
                <p>or</p>

                {/* Custom Provider Input Section */}
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    placeholder="Enter custom provider ID"
                    className="flex-1 h-[50px] px-4 rounded-[10px] border border-[#0000ee20] font-['Karla',Helvetica] font-normal text-black text-base"
                    value={customProviderId}
                    onChange={(e) => {
                      setCustomProviderId(e.target.value);
                      setErrorMessage(""); // Clear error when input changes
                    }}
                  />
                  <Button
                    onClick={handleCustomProviderSubmit}
                    className="h-[50px] px-6 bg-[#0000ee] text-white rounded-[10px]"
                    disabled={loadingState.type !== "none"}
                  >
                    {loadingState.type === "custom" ? "Loading..." : "Submit"}
                  </Button>
                </div>

                {/* Provider Details Display */}
                {providerName && providerIcon && (
                  <div className="flex items-center gap-2 mt-2 p-2 bg-gray-50 rounded-md">
                    <img
                      src={providerIcon}
                      alt={providerName}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="font-medium text-sm">{providerName}</span>
                  </div>
                )}

                {/* Error Message Display */}
                {errorMessage && (
                  <div className="text-red-500 text-sm mt-2 text-center">
                    {errorMessage}
                  </div>
                )}

                {/* Loading states */}
                {loadingState.type === "provider" &&
                  loadingState.step === "generating" &&
                  !requestUrl && (
                    <div className="text-center py-4 w-full">
                      <p className="text-[#0000ee] font-['Poppins',Helvetica]">
                        {isMobile
                          ? "Generating verification link..."
                          : "Generating QR code..."}
                      </p>
                    </div>
                  )}

                {loadingState.type === "custom" && (
                  <div className="text-center py-4 w-full">
                    <p className="text-[#0000ee] font-['Poppins',Helvetica]">
                      {loadingState.step === "generating"
                        ? isMobile
                          ? "Generating verification link..."
                          : "Generating QR code..."
                        : ""}
                    </p>
                  </div>
                )}

                {requestUrl && proofs.length === 0 && (
                  <>
                    <Card className="w-full p-2 mt-2 bg-white z-10">
                      <CardContent className="flex flex-col items-center gap-2 mt-2">
                        <h3 className="text-base sm:text-lg font-medium">
                          {isMobile ? "" : "Scan to generate proof"}
                        </h3>
                        {isMobile ? (
                          <Button
                            onClick={handleOpenLink}
                            className="w-full py-4 h-auto text-base bg-[#0000ee] text-white rounded-[10px]"
                          >
                            Verify Now
                          </Button>
                        ) : (
                          <div className="rounded-lg">
                            <QRCode
                              value={requestUrl}
                              size={160}
                              className="w-full max-w-[120px] sm:max-w-[160px] h-auto"
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <div className="w-full text-center mt-2">
                      <p className="text-sm text-gray-600">
                        That's not it, we've support for every single website
                        out there,{" "}
                        <a
                          href="https://dev.reclaimprotocol.org/explore"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0000ee] hover:underline"
                        >
                          explore more here
                        </a>
                      </p>
                    </div>
                  </>
                )}

                {proofs.length > 0 && (
                  <>
                    <Card className="w-full p-2 mt-2 bg-white z-10">
                      <CardContent className="flex flex-col items-center gap-2 mt-2">
                        <div className="w-full flex justify-between items-center flex-wrap gap-2">
                          <h3 className="text-base sm:text-lg font-medium">
                            Generated Proofs
                          </h3>
                          <Button
                            onClick={copyProofsToClipboard}
                            className="p-2 h-8"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-1"
                            >
                              <rect
                                width="14"
                                height="14"
                                x="8"
                                y="8"
                                rx="2"
                                ry="2"
                              />
                              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                            </svg>
                            Copy
                          </Button>
                        </div>
                        <div className="w-full p-2 sm:p-4 bg-gray-100 rounded-lg overflow-auto max-h-[200px] sm:max-h-[250px] md:max-h-[300px]">
                          <pre className="text-xs whitespace-pre-wrap break-words">
                            {JSON.stringify(proofs, null, 2)}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                    <div className="w-full text-center mt-2">
                      <p className="text-sm text-gray-600">
                        That's not it, we've support for every single website
                        out there,{" "}
                        <a
                          href="https://dev.reclaimprotocol.org/explore"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0000ee] hover:underline"
                        >
                          explore more here
                        </a>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <LogoScroller companyLogos={companyLogos} />
      </div>
    </main>
  );
};
