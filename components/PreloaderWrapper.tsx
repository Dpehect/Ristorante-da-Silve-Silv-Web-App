"use client";

import React, { useState } from 'react';
import Preloader from './Preloader';

export default function PreloaderWrapper({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && <Preloader onComplete={() => setIsLoaded(true)} />}
      <div className={isLoaded ? "opacity-100 transition-opacity duration-1000" : "opacity-0 pointer-events-none"}>
        {children}
      </div>
    </>
  );
}
