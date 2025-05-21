import React, { useState, useEffect } from "react";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { auth } from "@/firebase/init";

export const SessionTimer: React.FC = () => {
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isWarning, setIsWarning] = useState(false);

  const totalDuration = 60 * 60; // 1 hour in seconds

  // Calculate percentage remaining
  const percentRemaining = Math.min(100, Math.round((remainingTime / totalDuration) * 100));

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const monitorSession = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) return;

        const tokenResult = await getIdTokenResult(user);
        const expTime = new Date(tokenResult.expirationTime).getTime();
        const currentTime = new Date().getTime();
        const timeLeftInSeconds = Math.floor((expTime - currentTime) / 1000);
        setRemainingTime(timeLeftInSeconds);

        interval = setInterval(async () => {
          const now = new Date().getTime();
          const newTimeLeft = Math.floor((expTime - now) / 1000);
          setRemainingTime(newTimeLeft);
          setIsWarning(newTimeLeft < 120); // less than 2 mins
        }, 1000);
      });
    };

    monitorSession();

    return () => clearInterval(interval);
  }, []);

  const refreshSession = async () => {
    const user = auth.currentUser;
    if (user) {
      await user.getIdToken(true); // Force refresh
      const tokenResult = await getIdTokenResult(user);
      const expTime = new Date(tokenResult.expirationTime).getTime();
      const now = new Date().getTime();
      setRemainingTime(Math.floor((expTime - now) / 1000));
    }
  };

  const logout = async () => {
    await auth.signOut();
    window.location.reload(); // Optional: redirect to login page
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span>Session</span>
        <span className={isWarning ? "text-orange-500 font-medium" : ""}>
          {formatTime(remainingTime)}
        </span>
      </div>

      <Progress
        value={percentRemaining}
        className={`h-1.5 ${isWarning ? "bg-orange-100" : "bg-gray-100"}`}
      />

      {isWarning && (
        <div className="flex space-x-2 mt-2">
          <Button size="sm" variant="outline" onClick={refreshSession} className="text-xs h-7 px-2 py-1">
            Extend
          </Button>
          <Button size="sm" variant="ghost" onClick={logout} className="text-xs h-7 px-2 py-1">
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};
