import {useEffect, useState} from "react";
import {ApplicationVerifier, RecaptchaVerifier} from "firebase/auth";
import { auth } from "@/firebase/init";


export function useRecaptcha(componentId: string) {
    const [recaptcha, setRecaptcha] = useState<ApplicationVerifier>();

    useEffect(() => {
        const recaptchaVerifier = new RecaptchaVerifier(auth,componentId, {
            "size": "invisible",
            "callback": () => {                
            }
        });

        setRecaptcha(recaptchaVerifier);

        return () => {
            recaptchaVerifier.clear();
        }
    }, [componentId]);

    return recaptcha;
}