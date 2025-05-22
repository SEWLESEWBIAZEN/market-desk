
import { login, signInWithGoogle } from "@/firebase/authentication";
import { useState } from "react";
import { MultiFactorResolver } from "firebase/auth";
import { CodeSignIn } from "@/components/CodeSignIn";
import { Login } from "@/components/Login";
import { useNavigate } from "react-router-dom";
import { useRecaptcha } from "@/hooks/use-recaptcha";
import { toast } from "sonner";

export default function LoginPage() {

    const navigate = useNavigate();
    const recaptcha = useRecaptcha('sign-in');
    const [verificationId, setVerificationId] = useState<string>();
    const [resolver, setResolver] = useState<MultiFactorResolver>();

    async function loginWithGoogle() {
        const response = await signInWithGoogle();
        if (response === true) {
            navigate('/');
        } else {
            
        }
    }
    async function loginWithEmailAndPassword(email: string, password: string) {
        try {
            const response = await login(email, password);
            if (response !== null) {
                toast.success("Login Successful")
                navigate('/');
            } 
        }
        catch (e) {            
            toast.error("Something went wrong!")            
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {
                    !verificationId &&
                    !resolver &&
                    <Login
                        loginWithGoogle={loginWithGoogle}
                        loginWithEmailAndPassword={loginWithEmailAndPassword}
                    />
                }
                {
                    verificationId &&
                    resolver &&
                    <CodeSignIn
                        verificationId={verificationId}
                        resolver={resolver}
                    />
                }
                <div id='sign-in'></div>
            </div>
        </div>
    )
}