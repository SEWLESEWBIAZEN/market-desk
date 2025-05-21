import { At, GoogleLogo, Password } from "phosphor-react";
import { signInWithGoogle, signUp } from "@/firebase/authentication";
import { notify } from "@/utils/notify";
import { FormEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordStrengthIndicator } from "./auth/PasswordStrengthIndicator";
import authService from "@/services/authService";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";


export default function SignUp() {
    const [passwordValue,setPasswordValue]=useState<string>("")
    const [score,setScore]=useState<number>(0)
    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const navigate = useNavigate()

    async function loginWithGoogle() {
        const response = await signInWithGoogle();

        if (response !== true) {
            toast.error('Something went wrong');
            navigate("/sign-up")
        } 
        if (response) navigate("/")      
    }


    async function createAnAccount(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (email.current && password.current) {
            const response = await signUp(email.current.value, password.current.value);
            if(response){
                toast.success("Sign Up Successful")
                navigate("/login")
            }

            if (!response) {
               toast.error('Something went wrong.');
               navigate("/login")
            }
        }
    }
    
    // calculate the score of password strength
    useEffect(()=>{
        if(passwordValue) setScore(authService.checkPasswordStrength(passwordValue))
    },[passwordValue])
    
    return (
        <>
            <h2 className="mt-20 mb-8 text-3xl font-bold text-center text-gray-800">Create an account</h2>
            <button
                onClick={loginWithGoogle}
                className="rounded-xl relative flex gap-x-4 mb-8 text-black h-11 w-full items-center justify-center px-6 border border-gray-500">
                <GoogleLogo className='w-6 h-6' />
                <span className="relative text-base font-light">with Google</span>
            </button>
            <p className='text-center mb-8'>Or</p>
            <form
                className="space-y-8"
                onSubmit={createAnAccount}
            >
                <div className="space-y-4">
                    <div className="relative flex items-center">
                        <At className='w-6 h-6 absolute left-4 inset-y-0 my-auto' />
                        <input
                            ref={email}
                            type="email"
                            name="email"
                            placeholder="Insert your email"
                            className="focus:outline-none
                                        block w-full rounded-xl placeholder-gray-500
                                        bg-gray-100 pl-12 pr-4 h-12 text-gray-600 transition
                                        duration-300 invalid:ring-2 invalid:ring-red-400
                                        focus:ring-2 focus:ring-black"
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="relative flex items-center">
                        <Password className='w-6 h-6 absolute left-4 inset-y-0 my-auto' />
                        <input
                            ref={password}
                            value={passwordValue}
                            onChange={(e)=>setPasswordValue(e.target.value)}
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Insert your password"
                            className="focus:outline-none block w-full rounded-xl placeholder-gray-500 bg-gray-100 pl-12 pr-4 h-12 text-gray-600 transition duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 focus:ring-black"
                        />
                    </div>
                </div>
                {passwordValue!==""&&<PasswordStrengthIndicator score={score} />}
                <button type="submit"
                    className="bg-black rounded-xl flex h-11 w-full items-center justify-center px-6 hover:bg-gray-600">
                    <span
                        className="relative text-base font-light text-white">Sign Up</span>
                </button>
                <p className="border-t border-gray-100 pt-6 text-center text-sm text-gray-500">
                    Do you have an account ?<a href="/login" className="text-black"> Login</a>
                </p>
            </form>
        </>

    )
}