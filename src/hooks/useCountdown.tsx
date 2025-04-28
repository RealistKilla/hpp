import { useState, useEffect, useCallback, useRef } from "react";

// Type definitions
interface CountdownState {
  timeLeft: number;
  expired: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
}

interface CountdownTimerProps {
  targetTimeMs: number | undefined;
  onExpire: () => void | Promise<void>;
}

/**
 * A hook that provides countdown functionality based on a target timestamp
 * @param targetTimeMs - Target timestamp in milliseconds (epoch time)
 * @param onExpire - Callback function to be executed when timer expires
 * @returns Object containing countdown state and formatted time
 */
export const useCountdown = (
  targetTimeMs: number | undefined,
  onExpire?: () => void | Promise<void>
): CountdownState => {
  // Store the previous targetTimeMs to compare
  const prevTargetRef = useRef<number | undefined>(undefined);
  // Store whether onExpire was called for the current target
  const expiredForTargetRef = useRef<number | undefined>(undefined);
  // Store interval reference
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateTimeLeft = useCallback(() => {
    if (!targetTimeMs) {
      return {
        timeLeft: 0,
        expired: true,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const difference = targetTimeMs - Date.now();

    if (difference <= 0) {
      return {
        timeLeft: 0,
        expired: true,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      timeLeft: difference,
      expired: false,
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }, [targetTimeMs]);

  const [countdown, setCountdown] = useState(calculateTimeLeft());

  // Format time for display
  const formatTime = useCallback((): string => {
    if (countdown.expired) return "00:00:00";

    const { hours, minutes, seconds } = countdown;
    const padZero = (num: number): string => String(num).padStart(2, "0");

    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
  }, [countdown]);

  // Handle expiry only once per unique targetTimeMs
  const handleExpire = useCallback(async () => {
    // Only call onExpire if we haven't called it for this specific target time
    if (
      targetTimeMs &&
      expiredForTargetRef.current !== targetTimeMs &&
      onExpire
    ) {
      console.log("calling onExpire for target:", targetTimeMs);
      // Mark this target as expired
      expiredForTargetRef.current = targetTimeMs;

      try {
        await onExpire();
      } catch (error) {
        console.error("Error in onExpire callback:", error);
      }
    }
  }, [targetTimeMs, onExpire]);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Skip if no target time
    if (!targetTimeMs) {
      return;
    }

    // Check if targetTimeMs has changed
    const targetChanged = prevTargetRef.current !== targetTimeMs;
    if (targetChanged) {
      console.log(
        "Target changed from",
        prevTargetRef.current,
        "to",
        targetTimeMs
      );
      prevTargetRef.current = targetTimeMs;
    }

    // Calculate initial state
    const initialTimeLeft = calculateTimeLeft();
    setCountdown(initialTimeLeft);

    // If already expired, call onExpire once
    if (initialTimeLeft.expired) {
      handleExpire();
      return;
    }

    // Set up the timer
    intervalRef.current = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setCountdown(newTimeLeft);

      if (newTimeLeft.expired) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        handleExpire();
      }
    }, 1000);

    // Cleanup on unmount or targetTimeMs change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [targetTimeMs, calculateTimeLeft, handleExpire]);

  return {
    ...countdown,
    formatted: formatTime(),
  };
};
