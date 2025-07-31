/*  src/components/Spinner.jsx  */
import React from 'react';
import './Spinner.css';   // ← styles are separate so you can theme easily

export default function Spinner({ size = 48, message = 'Loading…' }) {
  return (
    <div
      className="spinner"
      role="status"
      aria-live="polite"
      aria-label={message}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 50 50"
        className="spinner__svg"
        width={size}
        height={size}
      >
        <circle
          className="spinner__circle"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        />
      </svg>
      <span className="sr-only">{message}</span>
    </div>
  );
}
