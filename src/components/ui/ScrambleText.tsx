"use client";

import { useEffect, useState, useRef } from "react";

const CHARS = "!@#$%^&*ABCDEFGHIJKLMNabcdefghijklmn0123456789?><";

interface ScrambleTextProps {
  text: string;
  delay?: number;       // ms before animation starts
  duration?: number;    // ms total for the full scramble → reveal
  className?: string;
}

export default function ScrambleText({
  text,
  delay = 0,
  duration = 800,
  className = "",
}: ScrambleTextProps) {
  const [displayed, setDisplayed] = useState(() =>
    text.split("").map(() => " ")
  );
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Keep spaces/symbols as-is (don't scramble them)
    const isStatic = (ch: string) => ch === " " || ch === "+";

    const startTimer = setTimeout(() => {
      const totalChars = text.length;
      // How many ms per character reveal
      const msPerChar = duration / totalChars;
      let revealedCount = 0;

      const tick = () => {
        setDisplayed((prev) => {
          const next = prev.slice();

          // Randomise all un-revealed, non-static characters
          for (let i = revealedCount; i < totalChars; i++) {
            next[i] = isStatic(text[i])
              ? text[i]
              : CHARS[Math.floor(Math.random() * CHARS.length)];
          }

          // Reveal the next character if it's time
          if (revealedCount < totalChars) {
            next[revealedCount] = text[revealedCount];
          }

          return next;
        });

        revealedCount++;

        if (revealedCount <= totalChars) {
          frameRef.current = setTimeout(tick, msPerChar);
        } else {
          // Ensure final state is exactly the original text
          setDisplayed(text.split(""));
        }
      };

      tick();
    }, delay);

    return () => {
      clearTimeout(startTimer);
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, [text, delay, duration]);

  return <span className={className}>{displayed.join("")}</span>;
}
