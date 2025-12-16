import { createContext, useContext, useEffect, useRef, useState } from "react";

export type LiveBackgroundStatus = "idle" | "loading" | "error" | "success";

interface LiveBackgroundProps {
  id?: string;
  status?: LiveBackgroundStatus;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const rnd = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

const rndBorderRadius = (): string =>
  [...Array(4).keys()].map(() => rnd(30, 85) + "%").join(" ") +
  " / " +
  [...Array(4).keys()].map(() => rnd(30, 85) + "%").join(" ");

const stateColors = {
  idle: [
    "rgba(191, 84, 123, 0.1)",
    "rgba(172, 121, 242, 0.1)",
    "rgba(145, 150, 242, 0.1)",
    "rgba(182, 197, 242, 0.1)",
    "rgba(242, 208, 189, 0.1)",
  ],
  loading: [
    "rgba(59, 130, 246, 0.05)",
    "rgba(96, 165, 250, 0.05)",
    "rgba(147, 197, 253, 0.05)",
    "rgba(219, 234, 254, 0.05)",
    "rgba(37, 99, 235, 0.05)",
  ], // Blues - faster
  success: [
    "rgba(16, 185, 129, 0.05)",
    "rgba(52, 211, 153, 0.05)",
    "rgba(110, 231, 183, 0.05)",
    "rgba(167, 243, 208, 0.05)",
    "rgba(5, 150, 105, 0.05)",
  ], // Greens - slower
  error: [
    "rgba(239, 68, 68, 0.1)",
    "rgba(248, 113, 113, 0.1)",
    "rgba(252, 165, 165, 0.1)",
    "rgba(254, 226, 226, 0.1)",
    "rgba(220, 38, 38, 0.1)",
  ], // Reds - slower
};

const stateDurations = {
  idle: 2000,
  loading: 700, // Faster animation for loading state
  success: 3000, // Slower
  error: 3000, // Slower
};

const liveBackgroundContext = createContext<{
  status: LiveBackgroundStatus;
  setStatus: (status: LiveBackgroundStatus) => void;
}>({
  status: "idle",
  setStatus: () => {
    // stub
  },
});

export const useLiveBackground = () => {
  return useContext(liveBackgroundContext);
};

export const LiveBackgroundProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [status, setStatus] = useState<LiveBackgroundStatus>("idle");

  const updateStatus = (newStatus: LiveBackgroundStatus) => {
    if (newStatus === status) return;
    setStatus(newStatus);
  };

  return (
    <liveBackgroundContext.Provider value={{ status, setStatus: updateStatus }}>
      {children}
    </liveBackgroundContext.Provider>
  );
};

export const LiveBackground = (props: LiveBackgroundProps) => {
  const { children, className = "" } = props;
  const { status: inheritedLiveBackgroundState } = useLiveBackground();
  const liveBackgroundState = props.status || inheritedLiveBackgroundState;
  const [isMounted, setIsMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const animationsRef = useRef<Map<number, number>>(new Map());

  // Refs to store current state values for the animation loop
  const durationRef = useRef(stateDurations[liveBackgroundState]);
  const colorsRef = useRef(stateColors[liveBackgroundState]);

  // Update refs and apply color changes immediately when state changes
  useEffect(() => {
    durationRef.current = stateDurations[liveBackgroundState];
    colorsRef.current = stateColors[liveBackgroundState];

    // Update existing blobs' colors immediately for smooth transition
    blobsRef.current.forEach((blob) => {
      const newColor = colorsRef.current[rnd(0, colorsRef.current.length - 1)];
      blob.style.backgroundColor = newColor;
    });
  }, [liveBackgroundState]);

  const animateBlob = (id: number) => {
    const blob = blobsRef.current.get(id);
    if (!blob) return;

    const duration = durationRef.current;

    const translateX = rnd(-25, 25);
    const translateY = rnd(-25, 25);
    const rotate = rnd(-25, 25);
    const opacity = rnd(80, 100) / 100; // Adjusted for already transparent colors
    const scale = rnd(125, 200) / 100;

    // Use specific transitions for different properties
    // Transform/opacity follow the movement duration (linear)
    // Background-color follows a fixed duration (ease) for smooth state transitions
    blob.style.transition = `transform ${duration}ms linear, opacity ${duration}ms linear, background-color 1000ms ease-in-out`;

    blob.style.transform = `translate(${translateX}%, ${translateY}%) rotate(${rotate}deg) scale(${scale})`;
    blob.style.opacity = opacity.toString();

    const timeoutId = window.setTimeout(() => {
      animateBlob(id);
    }, duration);

    animationsRef.current.set(id, timeoutId);
  };

  const initializeBlobs = () => {
    if (!containerRef.current) return;

    // Only initialize if empty
    if (blobsRef.current.size > 0) return;

    const blobCount = 12;
    const colors = colorsRef.current;
    const duration = durationRef.current;

    for (let id = 0; id < blobCount; id++) {
      const blob = document.createElement("div");
      const x = rnd(25, 75);
      const y = rnd(25, 75);
      const color = colors[rnd(0, colors.length - 1)];
      const scale = rnd(125, 200) / 100;
      const borderRadius = rndBorderRadius();

      blob.id = `blob-${id}`;
      blob.className = "live-background-blob";
      blob.style.cssText = `
                position: absolute;
                top: ${y}%;
                left: ${x}%;
                background-color: ${color};
                height: 25%;
                width: 12.5%;
                border-radius: ${borderRadius};
                filter: blur(15px);
                transform: scale(${scale});
                will-change: transform, opacity, background-color;
                transition: transform ${duration}ms linear, opacity ${duration}ms linear, background-color 1000ms ease-in-out;
            `;

      containerRef.current.appendChild(blob);
      blobsRef.current.set(id, blob);

      // Start animation with slight delay
      setTimeout(() => animateBlob(id), rnd(0, 1000));
    }
  };

  useEffect(() => {
    initializeBlobs();

    // Trigger appearance animation
    requestAnimationFrame(() => setIsMounted(true));

    return () => {
      // Cleanup animations on unmount
      animationsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      animationsRef.current.clear();
      blobsRef.current.clear();
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="w-screen h-screen" id={props.id}>
      <div
        className={`live-background-container ${className}`}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
        onClick={props.onClick}
      >
        <div
          ref={containerRef}
          className="live-background"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            zIndex: 0,
            opacity: isMounted ? 1 : 0,
            transition: "opacity 1000ms ease-in-out",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      </div>
    </div>
  );
};
