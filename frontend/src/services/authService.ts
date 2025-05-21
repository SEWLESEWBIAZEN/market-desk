// authService.ts
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth"
import { User } from "../types"
import { auth } from "@/firebase/init"
import { browserLocalPersistence, browserSessionPersistence } from "firebase/auth"

class AuthService {  
  // Check password strength (same as before)
  checkPasswordStrength(password: string): number {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return Math.min(score, 4)
  }

  getPasswordFeedback(score: number): { text: string; color: string } {
    switch (score) {
      case 0:
        return { text: "Very weak", color: "bg-red-500" }
      case 1:
        return { text: "Weak", color: "bg-orange-500" }
      case 2:
        return { text: "Fair", color: "bg-yellow-500" }
      case 3:
        return { text: "Good", color: "bg-blue-500" }
      case 4:
        return { text: "Strong", color: "bg-green-500" }
      default:
        return { text: "Invalid", color: "bg-gray-500" }
    }
  }

  // Login with Firebase
  async login(email: string, password: string, rememberMe: boolean): Promise<User> {
    try {
      if (rememberMe) {
        // Persist across sessions
        await auth.setPersistence(browserLocalPersistence)
      } else {
        await auth.setPersistence(browserSessionPersistence)
      }

      const result = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = result.user

      return this.mapFirebaseUser(firebaseUser)
    } catch (error) {
      throw new Error("Invalid email or password")
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        unsubscribe()
        if (firebaseUser) {
          resolve(this.mapFirebaseUser(firebaseUser))
        } else {
          resolve(null)
        }
      })
    })
  }

  // Logout from Firebase
  async logout(): Promise<boolean> {
    try {
      await signOut(auth)
      return true
    } catch (err) {
      console.error("Logout failed:", err)
      return false
    }
  }


  
  // Refresh session
  refreshSession(): void {
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime()+ 60);
    
    localStorage.setItem("session_expiry", expiryDate.toISOString());
    sessionStorage.setItem("session_expiry", expiryDate.toISOString());
  }

  // Get remaining session time in seconds
  getSessionTimeRemaining(): number {
   const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime()+ 60);
    
    if (!expiryDate) {
      return 0;
    }
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    const remaining = Math.max(0, (expiry.getTime() - now.getTime()) / 1000);
    
    return Math.round(remaining);
  }



  // Placeholder for 2FA (would need to integrate Firebase 2FA or external 2FA service)
  async verifyTwoFactor(userId: string, code: string): Promise<boolean> {
    return /^\d{6}$/.test(code) // demo only
  }

  // Convert Firebase user to app User type
  private mapFirebaseUser(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      name: firebaseUser.displayName || "Unnamed",
      avatar: firebaseUser.photoURL || "/placeholder.svg",
      role: "user", // optionally retrieve from Firestore or custom claims
      lastLogin: new Date(), // Firebase doesn't provide last login by default
      twoFactorEnabled: false, // extend if needed
    }
  }
}

export const authService = new AuthService()
export default authService

