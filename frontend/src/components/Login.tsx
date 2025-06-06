import { At, GoogleLogo, Password } from "phosphor-react";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
    loginWithGoogle: () => void,
    loginWithEmailAndPassword: (email: string, password: string) => void
}

export function Login({ loginWithGoogle, loginWithEmailAndPassword }: Props) {

    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const [isPending, setIsPending] = useState(false)

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        setIsPending(true)
        event.preventDefault();

        if (email.current && password.current) {
            loginWithEmailAndPassword(email.current.value, password.current.value);
        } else {
            toast.error("Something went wrong.")
        }
        setIsPending(false)
    }

    return (
        <>
            <div className="flex flex-col">
                <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>
                <span className="w-full text-sm  mx-auto text-center text-gray-500">Welcome back to Market Desk👋</span>
            </div>
            <button
                onClick={loginWithGoogle}
                className="rounded-xl flex gap-x-4 mb-8 text-black h-11 w-full items-center justify-center px-6 border border-gray-500">
                <GoogleLogo className='w-6 h-6' />
                <span className="relative text-base font-light">with Google</span>
            </button>
            <p className='text-center mb-8'>Or</p>
            <form
                className="space-y-8"
                onSubmit={handleSubmit}
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
                <div className="space-y-4 my-6">
                    <div className="relative flex items-center">
                        <Password className='w-6 h-6 absolute left-4 inset-y-0 my-auto' />
                        <input
                            ref={password}
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Insert your password"
                            className="focus:outline-none block w-full rounded-xl placeholder-gray-500 bg-gray-100 pl-12 pr-4 h-12 text-gray-600 transition duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 focus:ring-black"
                        />
                    </div>
                </div>

                <button type="submit" disabled={isPending} 
                    className={`bg-black rounded-xl flex h-11 w-full items-center justify-center px-6 hover:bg-gray-600 ${isPending ? "bg-gray-600" : ""}`} >
                    <span
                        className="text-base font-light text-white">
                        Login
                    </span>
                </button>
                <p className="border-t border-gray-100 pt-6 text-center text-sm text-gray-500">
                    Don't have an account ?<a href="/sign-up" className="text-black"> Sign up</a>
                </p>
            </form>
        </>
    )
}
