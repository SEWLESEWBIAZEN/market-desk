
import {login, signInWithGoogle, verifyUserMFA} from "@/firebase/authentication";
import {useState} from "react";
import {MultiFactorResolver} from "firebase/auth";
import {CodeSignIn} from "@/components/CodeSignIn";
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
        }else {
            await handleMFA(response);
         }
    }

    async function loginWithEmailAndPassword(email: string, password: string) {
        const response = await login(email, password);

        if (response === true) {
            toast.success("Login Successful")
            navigate('/');
        }else {
            await handleMFA(response);
        }
    }

    async function handleMFA(response: any) {
        console.log(response.code)
        if (response.code === 'auth/multi-factor-auth-required' && recaptcha) {
            const data = await verifyUserMFA(
                response,
                recaptcha,
                0
            )

            if (!data) {
               toast.error('Something went wrong.');
            }else {
                const {verificationId, resolver} = data;
                setVerificationId(verificationId);
                setResolver(resolver);
            }
        }else {
            toast.error('Something went wrong');
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