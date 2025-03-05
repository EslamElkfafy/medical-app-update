"use client";
// import Lottie from "lottie-react";
import React from "react";
import dynamic from 'next/dynamic';
import LoaderAnimation from "../public/animations/heartbeat.json";
export default function Loading() {
  const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-[400px] ">
          <Lottie animationData={LoaderAnimation} loop={true} />
        </div>
      </div>
    </div>
  );
}
