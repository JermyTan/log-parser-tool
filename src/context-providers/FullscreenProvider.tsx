import React, { createContext, useState } from "react";

type FullscreenContextType = {
  isFullscreen: boolean;
  setFullscreen: (isFullscreen: boolean) => void;
};

export const FullscreenContext = createContext<FullscreenContextType>({
  isFullscreen: false,
  setFullscreen: (isFullscreen: boolean) => {},
});

function FullscreenProvider(props: any) {
  const [isFullscreen, setFullscreen] = useState(false);

  return (
    <FullscreenContext.Provider value={{ isFullscreen, setFullscreen }}>
      {props.children}
    </FullscreenContext.Provider>
  );
}

export default FullscreenProvider;
