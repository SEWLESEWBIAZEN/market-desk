
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "lucide-react";

interface TwoFactorFormProps {
  onSuccess: () => void;
}

export const TwoFactorForm: React.FC<TwoFactorFormProps> = ({ onSuccess }) => {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30); // Countdown timer in seconds
  
  const { verifyTwoFactor } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-focus the input field
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").substring(0, 6);
    setCode(value);
    
    // Auto-submit when 6 digits entered
    if (value.length === 6) {
      handleSubmit(value);
    }
  };
  
  const handleSubmit = async (submittedCode?: string) => {
    try {
      setIsSubmitting(true);
      setError("");
      
      const codeToVerify = submittedCode || code;
      
      if (codeToVerify.length !== 6) {
        setError("Please enter a 6-digit code");
        setIsSubmitting(false);
        return;
      }
      
      const success = await verifyTwoFactor(codeToVerify);
      
      if (success) {
        onSuccess();
      } else {
        setError("Invalid verification code");
      }
    } catch (err) {
      setError((err as Error).message || "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResendCode = () => {
    // In a real app, this would call an API endpoint
    setTimeLeft(30);
    setTimeout(() => {
      // Simulate code being sent
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 1000);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Two-Factor Authentication</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <p className="text-sm text-muted-foreground">
            A verification code has been sent to your device. Please enter the 6-digit code.
          </p>
          
          <div className="space-y-2">
            <Input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="Enter 6-digit code"
              value={code}
              onChange={handleChange}
              className="text-center text-lg tracking-widest"
              disabled={isSubmitting}
              autoComplete="one-time-code"
            />
            
            <p className="text-xs text-center text-muted-foreground">
              For demo purposes, enter any 6-digit number like 123456
            </p>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || code.length !== 6}
          >
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" /> Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="w-full text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Didn't receive a code?
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResendCode}
            disabled={timeLeft > 0}
          >
            {timeLeft > 0 ? `Resend code (${timeLeft}s)` : "Resend code"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
