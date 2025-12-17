import React from "react";

// Hook for responsive screen size detection
export const useIsLargeScreen = (breakpoint: number = 640): boolean => {
  const [isLarge, setIsLarge] = React.useState(
    typeof window !== "undefined" ? window.innerWidth > breakpoint : false,
  );

  React.useEffect(() => {
    const handleResize = () => {
      setIsLarge(window.innerWidth > breakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isLarge;
};
