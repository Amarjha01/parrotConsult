// Loader.jsx
import React from "react";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0c352f] bg-opacity-80 z-50">
      <div className="loader-spinner"></div>
      <style>
        {`
          .loader-spinner {
            width: 64px;
            height: 64px;
            border: 8px solid #499a6c;
            border-top: 8px solid #ce633b;
            border-right: 8px solid #1a7055;
            border-bottom: 8px solid #0c352f;
            border-radius: 50%;
            animation: spin 1.1s linear infinite;
            box-shadow: 0 0 18px #1a705588;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
}
