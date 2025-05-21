// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { AuthState, User } from "../types";
import { auth } from "@/firebase/init";
import {
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  sessionExpiry: null,
};

type AuthAction =
  | { type: "LOADING" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; expiryDate: Date } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "SESSION_EXPIRED" }
  | { type: "REFRESH_SESSION"; payload: Date }
  | { type: "CLEAR_ERROR" };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOADING":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        sessionExpiry: action.payload.expiryDate,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        sessionExpiry: null,
      };
    case "LOGOUT":
      return { ...initialState, isLoading: false };
    case "SESSION_EXPIRED":
      return {
        ...initialState,
        isLoading: false,
        error: "Your session has expired. Please log in again.",
      };
    case "REFRESH_SESSION":
      return { ...state, sessionExpiry: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  refreshSession: () => void;
  clearError: () => void;
  getSessionTimeRemaining: () => number;
  verifyTwoFactor: (code: string) => Promise<boolean>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { toast } = useToast();

  const toUser = (firebaseUser: FirebaseUser): User => ({
    id: firebaseUser.uid,
    email: firebaseUser.email!,
    name: firebaseUser.displayName || "User",
    role:'admin',
    twoFactorEnabled:false
  });

  const monitorSession = (expiryDate: Date) => {
    const now = new Date();
    const timeUntilExpiry = expiryDate.getTime() - now.getTime();
    const warningTime = 2 * 60 * 1000;

    if (timeUntilExpiry <= 0) {
      dispatch({ type: "SESSION_EXPIRED" });
      logout();
      return;
    }

    if (timeUntilExpiry > warningTime) {
      setTimeout(() => {
        toast({
          title: "Session Expiring Soon",
          description: "Your session will expire in 2 minutes. Click to extend.",
          action: (
            <button
              onClick={refreshSession}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
            >
              Extend Session
            </button>
          ),
        });
      }, timeUntilExpiry - warningTime);
    }

    setTimeout(() => {
      dispatch({ type: "SESSION_EXPIRED" });
      logout();
      toast({
        title: "Session Expired",
        description: "Please log in again.",
        variant: "destructive",
      });
    }, timeUntilExpiry);
  };

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      dispatch({ type: "LOADING" });

      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const expiryDate = new Date(Date.now() + 30 * 60 * 1000); // 30 min session for example
      localStorage.setItem("session_expiry", expiryDate.toISOString());

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: toUser(user), expiryDate },
      });

      monitorSession(expiryDate);
    } catch (error: any) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message || "Login failed" });
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("session_expiry");
    dispatch({ type: "LOGOUT" });
  };

  const refreshSession = () => {
    const expiryDate = new Date(Date.now() + 30 * 60 * 1000); // Extend another 30 minutes
    localStorage.setItem("session_expiry", expiryDate.toISOString());
    dispatch({ type: "REFRESH_SESSION", payload: expiryDate });
    monitorSession(expiryDate);
    toast({
      title: "Session Extended",
      description: "Your session has been extended.",
    });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const getSessionTimeRemaining = (): number => {
    const expiryStr = localStorage.getItem("session_expiry") || sessionStorage.getItem("session_expiry");
    if (!expiryStr) return 0;
    const expiry = new Date(expiryStr).getTime();
    return Math.max(0, expiry - Date.now());
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const expiryStr = localStorage.getItem("session_expiry") || sessionStorage.getItem("session_expiry");
        const expiryDate = expiryStr ? new Date(expiryStr) : new Date(Date.now() + 30 * 60 * 1000);
        dispatch({ type: "LOGIN_SUCCESS", payload: { user: toUser(firebaseUser), expiryDate } });
        monitorSession(expiryDate);
      } else {
        dispatch({ type: "LOGOUT" });
      }
    });

    return () => unsubscribe();
  }, []);

  const verifyTwoFactor = async (code: string): Promise<boolean> => {
  // Your logic to verify the code with Firebase or custom backend
  try {
    const response = await fetch('/api/verify-2fa', {
      method: 'POST',
      body: JSON.stringify({ code }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) return false;

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("2FA verification error:", error);
    return false;
  }
};


  const value: AuthContextType = {
    ...state,
     login,
  logout,
  refreshSession,
  clearError,
  getSessionTimeRemaining,  
  verifyTwoFactor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
