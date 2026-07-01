"use client";

import { useState } from "react";
import Preloader from "./Preloader";

export default function PreloaderWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      <div style={{ opacity: isLoading ? 0 : 1, transition: "opacity 1s ease-in-out" }}>
        {children}
      </div>
    </>
  );
}
