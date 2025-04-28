import React from "react";
import { useCountdown } from "@/hooks/useCountdown";

export const CountdownTimer: React.FC<{
  targetTimeMs: number;
  onExpire?: () => void;
}> = ({ targetTimeMs, onExpire }) => {
  const { minutes, seconds } = useCountdown(targetTimeMs, onExpire);

  return (
    <div>
      {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
};
