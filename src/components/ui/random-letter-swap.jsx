import React, { useState, useEffect } from "react";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?-=[];',./~";

export function RandomLetterSwap({ label, className, isHovered = false }) {
  const [displayText, setDisplayText] = useState(label);
  const [localHover, setLocalHover] = useState(false);

  const active = isHovered || localHover;

  useEffect(() => {
    let interval;
    if (active) {
      let iteration = 0;
      interval = setInterval(() => {
        setDisplayText((prev) =>
          label
            .split("")
            .map((char, index) => {
              if (index < iteration) {
                return label[index];
              }
              if (char === " ") return " ";
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= label.length) {
          clearInterval(interval);
        }

        // 0.3 letters per 100ms tick. About 300ms per letter to lock in.
        iteration += 0.3; 
      }, 100);
    } else {
      setDisplayText(label);
    }
    return () => clearInterval(interval);
  }, [active, label]);

  return (
    <span
      className={className}
      onMouseEnter={() => setLocalHover(true)}
      onMouseLeave={() => setLocalHover(false)}
      onTouchStart={() => setLocalHover(true)}
      onTouchEnd={() => setTimeout(() => setLocalHover(false), 500)}
    >
      {displayText}
    </span>
  );
}
