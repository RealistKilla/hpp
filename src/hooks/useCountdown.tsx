import { useState, useEffect, useRef, useCallback } from "react";

interface UseCountdownOptions {
  /** Called once, exactly when the timer reaches 0 */
  onExpire?: () => void;
}

export function useCountdown(
  targetTimeMs: number,
  { onExpire }: UseCountdownOptions = {}
) {
  // Compute initial seconds left (rounded up so partial seconds count)
  const calcInitialSeconds = () =>
    Math.max(Math.ceil((targetTimeMs - Date.now()) / 1000), 0);

  const [secondsLeft, setSecondsLeft] = useState(calcInitialSeconds);
  //   const onExpireRef = useRef(onExpire);

  // Keep callback ref up to date without re-running effect
  //   useEffect(() => {
  //     onExpireRef.current = onExpire;
  //   }, [onExpire]);

  useEffect(() => {
    // Whenever targetTimeMs changes, reset the countdown
    setSecondsLeft(calcInitialSeconds());

    if (secondsLeft === 0) {
      onExpire?.();
      return;
    }

    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
    // We intentionally omit secondsLeft here so the interval logic
    // always runs freshly when targetTimeMs changes
  }, [targetTimeMs]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return { minutes, seconds, secondsLeft };
}
