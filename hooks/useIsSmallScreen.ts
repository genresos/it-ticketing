import { useEffect, useState } from "react";

const getMatches = (maxWidth?: string): boolean => {
  // Prevents SSR issues
  if (typeof window !== "undefined") {
    return window.matchMedia(`(max-width: ${maxWidth || "768px"})`).matches;
  }
  return false;
};

const useIsSmallScreen = (maxWidth?: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    setMatches(getMatches(maxWidth));
  }, []);

  useEffect(() => {
    const query = `(max-width: ${maxWidth || "768px"})`;
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Listen matchMedia
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxWidth]);

  return matches;
};

export default useIsSmallScreen;
