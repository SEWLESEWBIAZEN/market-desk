
import React from "react";
import { authService } from "@/services/authService";

interface PasswordStrengthIndicatorProps {
  score: number;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ score }) => {
  const feedback = authService.getPasswordFeedback(score);
  
  // Create an array of 4 segments
  const segments = [1, 2, 3, 4];
  
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {segments.map((segment) => (
          <div
            key={segment}
            className={`h-2 flex-1 rounded-sm ${
              segment <= score ? feedback.color : "bg-gray-200"
            }`}
          ></div>
        ))}
      </div>
      <div className="text-xs text-muted-foreground">
        Password strength: {feedback.text}
      </div>
      
      {score <= 2 && (
        <div className="text-xs text-muted-foreground">
          Tip: Use at least 8 characters with uppercase, lowercase, numbers, and special characters.
        </div>
      )}
    </div>
  );
};
